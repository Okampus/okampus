import './morgan/morgan.register';
import './graphql/enums.register';

import { corsValidation } from './cors.validation';
import { config } from '../../configs/config';
import { AppModule } from '../app.module';
import { MAX_FILES, MAX_FILE_SIZE } from '@okampus/shared/consts';

import { isFileUpload } from '@okampus/shared/utils';
import { OIDCCacheService, tenantStrategyFactory, UsersService } from '@okampus/api/bll';
import { TenantCoreRepository } from '@okampus/api/dal';

import { Issuer } from 'openid-client';
import helmet from 'helmet';

import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { processRequest } from 'graphql-upload-minimal';

import * as SentryTracing from '@sentry/tracing';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import fastify from 'fastify';

import * as fastifyMulter from 'fastify-multer';
import fastifyCookie from '@fastify/cookie';
import fastifySecureSession from '@fastify/secure-session';
import fastifyRequestContext from '@fastify/request-context';
import fastifyPassport from '@fastify/passport';
import fastifyCors from '@fastify/cors';

import path from 'node:path';

import type { Strategy } from '@fastify/passport';
import type { FastifyReply } from 'fastify/types/reply';
import type { FastifyRequest } from 'fastify/types/request';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { INestApplication } from '@nestjs/common';
import type { Snowflake } from '@okampus/shared/types';

const logger = new Logger('Bootstrap');
const sessionKey = Buffer.from(config.session.secret, 'ascii');

const cspConfigDevelopment = {
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
};

const authenticateOptions = { authInfo: false, successRedirect: '/auth/oidc-callback' };

export async function bootstrap(): Promise<INestApplication> {
  if (config.sentry.enabled) SentryTracing.addExtensionMethods();

  const fastifyInstance = fastify({ trustProxy: false });

  fastifyInstance.addHook('preValidation', async (req, reply) => {
    if (isFileUpload(req) && req.url === '/graphql') {
      req.body = await processRequest(req.raw, reply.raw, { maxFileSize: MAX_FILE_SIZE, maxFiles: MAX_FILES });
    }
  });

  await fastifyInstance.register(fastifyCookie, { secret: config.cookies.signature });
  await fastifyInstance.register(fastifySecureSession, { key: sessionKey, cookie: { path: '/', httpOnly: true } });
  await fastifyInstance.register(fastifyPassport.initialize());
  await fastifyInstance.register(fastifyPassport.secureSession());

  await fastifyInstance.register(fastifyMulter.contentParser);
  await fastifyInstance.register(fastifyCors, { origin: corsValidation, credentials: true });
  await fastifyInstance.register(fastifyRequestContext, {
    hook: 'preValidation',
    defaultStoreValues: {
      requester: null,
      tenant: null,
      gqlInfo: null,
      alreadyPopulated: false,
    },
  });

  /* @ts-expect-error - Conflicting types despite no errors on launch */
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyInstance));

  const oidcStrategyCache = app.get<OIDCCacheService>(OIDCCacheService);
  const tenantCoreRepository = app.get<TenantCoreRepository>(TenantCoreRepository);
  const usersService = app.get<UsersService>(UsersService);

  fastifyPassport.registerUserSerializer(async (user: { id: Snowflake }, _request) => user.id);
  fastifyPassport.registerUserDeserializer(async (id: Snowflake, _request) => await usersService.findBareById(id));

  fastifyInstance.get(
    '/auth/:domain',
    {
      preValidation: async (req, res) => {
        const domain = (req.params as { tenant: string }).tenant;
        const tenant = await tenantCoreRepository.findOneOrFail({ domain });
        if (!tenant) return false;

        if (!oidcStrategyCache.strategies.has(domain)) {
          const oidc = tenant.oidcInfo;
          const { oidcEnabled, oidcClientId, oidcClientSecret, oidcDiscoveryUrl, oidcScopes, oidcCallbackUri } = oidc;
          if (
            !oidcEnabled ||
            !oidcClientId ||
            !oidcClientSecret ||
            !oidcDiscoveryUrl ||
            !oidcScopes ||
            !oidcCallbackUri
          )
            return false;

          const TrustIssuer = await Issuer.discover(oidcDiscoveryUrl);
          const client = new TrustIssuer.Client({ client_id: oidcClientId, client_secret: oidcClientSecret });

          const oidcConfig = { redirect_uri: oidcCallbackUri, scope: oidcScopes };
          const strategy = tenantStrategyFactory(usersService, domain, oidcConfig, client);
          oidcStrategyCache.strategies.set(domain, strategy);
        }

        const strategy = oidcStrategyCache.strategies.get(domain) as Strategy;
        await fastifyPassport.authenticate(strategy, { authInfo: false }).bind(fastifyInstance)(req, res);

        return true;
      },
    },
    () => ({})
  );

  const tenantCallbackValidation = async (req: FastifyRequest, res: FastifyReply) => {
    const tenantSlug = (req.params as { tenant: string }).tenant;
    const strategy = oidcStrategyCache.strategies.get(tenantSlug) as Strategy;
    await fastifyPassport.authenticate(strategy, authenticateOptions).bind(fastifyInstance)(req, res);
  };
  fastifyInstance.get('/auth/:tenant/callback', { preValidation: tenantCallbackValidation }, () => ({}));

  app.use(helmet(config.env.isProd() ? {} : cspConfigDevelopment));

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    })
  );

  if (!config.s3.enabled)
    app.useStaticAssets({
      root: path.join(__dirname, '..', '..', '..', 'apps/api', config.upload.path),
      prefix: `/${config.upload.path}`,
    });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Okampus Web API')
    .setDescription('REST API for Okampus')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  logger.log('Documentation available at /docs');

  await app.listen(config.network.port, '0.0.0.0');
  const url = await app.getUrl();
  logger.log(`API running on: ${url.replace('[::1]', 'localhost')}`);

  return app;
}
