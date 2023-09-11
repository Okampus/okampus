import './graphql/enums.register';

import { corsValidation } from './cors.validation';
import { tenantCallbackValidation, tenantStrategyValidation } from './tenant.validation';
import { uploadPreValidation } from './upload.validation';

import { AppModule } from '../app.module';
import { config } from '../config';

import { AuthService, OIDCCacheService } from '@okampus/api/bll';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import helmet from 'helmet';
import fastify from 'fastify';
import fastifyMulter from 'fastify-multer';
import fastifyCookie from '@fastify/cookie';
import fastifySecureSession from '@fastify/secure-session';
import fastifyRequestContext from '@fastify/request-context';
import fastifyPassport from '@fastify/passport';
import fastifyCors from '@fastify/cors';

import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { INestApplication, Logger } from '@nestjs/common';

const sessionKey = Buffer.from(config.session.secret, 'ascii').subarray(0, 32);

const defaultCsp = { contentSecurityPolicy: false, crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false };
const defaultStoreValues = { requester: undefined, tenant: undefined, token: undefined };

const authenticateOptions = { authInfo: false, successRedirect: '/auth/oidc-callback' };

const transformOptions = { enableImplicitConversion: true };
const validationPipeOptions = { transform: true, transformOptions, forbidNonWhitelisted: true, whitelist: true };

export async function bootstrap(logger: Logger): Promise<INestApplication> {
  const fastifyInstance = fastify({ trustProxy: false });
  fastifyInstance.addHook('preValidation', uploadPreValidation);

  await fastifyInstance.register(fastifyCookie, { secret: config.cookies.signature });
  await fastifyInstance.register(fastifySecureSession, { key: sessionKey, cookie: { path: '/', httpOnly: true } });
  await fastifyInstance.register(fastifyPassport.initialize());
  await fastifyInstance.register(fastifyPassport.secureSession());
  await fastifyInstance.register(fastifyMulter.contentParser);
  await fastifyInstance.register(fastifyCors, { origin: corsValidation, credentials: true });
  await fastifyInstance.register(fastifyRequestContext, { hook: 'preValidation', defaultStoreValues });

  // @ts-expect-error - fastify types are not up to date
  const fastifyAdapter = new FastifyAdapter(fastifyInstance);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, { logger });

  const oidcCache = app.get<OIDCCacheService>(OIDCCacheService);
  const authService = app.get<AuthService>(AuthService);

  fastifyPassport.registerUserSerializer(async (user: { id: string }) => user.id);
  fastifyPassport.registerUserDeserializer(async (id: string) => await authService.findUser(id));

  const preValidationContext = { authService, oidcCache, fastifyInstance, fastifyPassport };

  const tenantStrategyPreValidation = tenantStrategyValidation(preValidationContext);
  fastifyInstance.get('/auth/:oidcName', { preValidation: tenantStrategyPreValidation }, () => ({}));

  const tenantCallbackPreValidation = tenantCallbackValidation({ ...preValidationContext, authenticateOptions });
  // @ts-expect-error - fastify types are not up to date
  fastifyInstance.get(
    '/auth/:oidcName/callback',
    { preValidation: tenantCallbackPreValidation },
    // @ts-expect-error - any type
    async (req, res, err, user) => {
      if (err || !user) throw err;
      await authService.refreshSession(req, res, user.id);
      res.redirect(303, `${user.tenantScope.domain}.okampus.fr`);
    },
  );

  app.enableShutdownHooks();
  app.use(helmet(config.env.isProd() ? {} : defaultCsp));
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  if (!config.s3.isEnabled)
    app.useStaticAssets({ root: config.upload.localPath, prefix: `/${config.upload.localPrefix}` });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Okampus Web API')
    .setDescription('REST API for Okampus')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  logger.log('Documentation available at /docs');

  return app;
}
