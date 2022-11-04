/* eslint-disable node/no-sync */
// Hack to get Multer to register its typings into the global scope, because why not
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780#issuecomment-790684085
import 'multer';
import './shared/lib/morgan.register';

// KEEP FOR LOCALHOST DEBUG - import fs from 'node:fs';
import path from 'node:path';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyPassport from '@fastify/passport';
import fastifySecureSession from '@fastify/secure-session';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as SentryTracing from '@sentry/tracing';
import fastify from 'fastify';
import * as multer from 'fastify-multer';
// eslint-disable-next-line import/no-unresolved, @typescript-eslint/no-unused-vars
import _ from 'fastify-multer/typings/fastify'; // Import to ensure that plugin typings are loaded
import { processRequest } from 'graphql-upload-minimal';
import helmet from 'helmet';
import { Issuer } from 'openid-client';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { tenantStrategyFactory } from './auth/tenant.strategy';
import { config } from './shared/configs/config';
import { APP_OIDC_CACHE } from './shared/lib/constants';
import { TenantsService } from './tenants/tenants/tenants.service';
import { UsersService } from './users/users.service';

const logger = new Logger('Bootstrap');

function setupSwagger(app: NestFastifyApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Okampus Web API')
    .setDescription('REST API for Okampus')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  logger.log('Documentation available at /docs');
}

async function bootstrap(): Promise<void> {
  if (config.sentry.enabled)
    SentryTracing.addExtensionMethods();

  const fastifyInstance = fastify({
    trustProxy: false,
    // KEEP FOR LOCALHOST DEBUG - https: {
    //   key: fs.readFileSync('./secrets/server.key'),
    //   cert: fs.readFileSync('./secrets/server.crt'),
    // },
    logger: {
      level: 'trace',
    },
  });

  fastifyInstance.addHook('preValidation', async (_request, _reply) => {
    if (_request.headers['content-type']?.startsWith('multipart/form-data') && _request.url === '/graphql') {
      _request.body = await processRequest(_request.raw, _reply.raw, {
        maxFileSize: 10_000_000, // 10 MB
        maxFiles: 20,
      });
    }
  });

  await fastifyInstance.register(fastifyCookie, {
    secret: config.cookies.signature,
  });

  await fastifyInstance.register(fastifySecureSession, {
    key: Buffer.from(config.session.secret, 'ascii'),
    cookie: {
      path: '/',
      httpOnly: true,
    },
  });

  await fastifyInstance.register(fastifyPassport.initialize());
  await fastifyInstance.register(fastifyPassport.secureSession());

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyInstance));
  await app.register(multer.contentParser);

  await app.register(fastifyCors, config.env.isProd() ? {
    origin: (origin, cb): void => {
      cb(null, /^https:\/\/(?:[\dA-Za-z][\dA-Za-z-]{1,61}[\dA-Za-z])+\.okampus\.fr(?::\d+)?/.test(origin));
    },
    credentials: true,
  } : {
    origin: config.network.frontendUrl,
    credentials: true,
  });

  const oidcStrategyCache = app.get(APP_OIDC_CACHE);
  const tenantsService = app.get<TenantsService>(TenantsService);
  const authService = app.get<AuthService>(AuthService);
  const usersService = app.get<UsersService>(UsersService);


  // eslint-disable-next-line @typescript-eslint/require-await
  fastifyPassport.registerUserSerializer(async (user: { id: string }, _request) => user.id);
  fastifyPassport.registerUserDeserializer(async (id: string, _request) => await usersService.findOneById(id));

  fastifyInstance.get('/auth/:tenant', {
    preValidation: async (req, res) => {
      const tenantId = (req.params as { tenant: string }).tenant;
      const tenant = await tenantsService.findOne(tenantId);
      if (!tenant)
        return false;

      if (!oidcStrategyCache.strategies.has(tenantId)) {
        const {
          oidcEnabled,
          oidcClientId,
          oidcClientSecret,
          oidcDiscoveryUrl,
          oidcScopes,
          oidcCallbackUri,
        } = tenant;

        if (!oidcEnabled)
          return false;

        const TrustIssuer = await Issuer.discover(oidcDiscoveryUrl!);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const client = new TrustIssuer.Client({ client_id: oidcClientId!, client_secret: oidcClientSecret! });
        oidcStrategyCache.strategies.set(tenantId, tenantStrategyFactory(
          authService,
          tenantId,
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            redirect_uri: oidcCallbackUri!,
            scope: oidcScopes!,
          },
          client,
        ));
      }

      await fastifyPassport
              .authenticate(oidcStrategyCache.strategies.get(tenantId), { authInfo: false })
              .bind(fastifyInstance)(req, res);
    },
  }, () => ({}));

  fastifyInstance.get('/auth/:tenant/callback', {
    preValidation: async (req, res) => {
      const tenantId = (req.params as { tenant: string }).tenant;
      await fastifyPassport
        .authenticate(oidcStrategyCache.strategies.get(tenantId), { authInfo: false, successRedirect: '/auth/login-tenant' })
        .bind(fastifyInstance)(req, res);
    },
  }, () => ({}));

  if (config.env.isProd()) {
    app.use(helmet());
  } else {
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
  }

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
    whitelist: true,
  }));

  if (!config.s3.enabled) {
    app.useStaticAssets({
      root: path.join(__dirname, '..', config.upload.path),
      prefix: '/uploads',
    });
  }

  setupSwagger(app);

  await app.listen(config.network.port, '0.0.0.0');
  const url = await app.getUrl();
  logger.log(`API running on: ${url.replace('[::1]', 'localhost')}`);
}

void bootstrap();
