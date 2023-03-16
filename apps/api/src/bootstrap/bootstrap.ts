import './morgan/morgan.register';
import './graphql/enums.register';

import { corsValidation } from './cors.validation';
import { tenantCallbackValidation, tenantStrategyValidation } from './tenant.validation';
import { uploadPreValidation } from './upload.validation';

import { AppModule } from '../app.module';
import { config } from '../../configs/config';

import { OIDCCacheService, UsersService } from '@okampus/api/bll';
import { TenantCoreRepository } from '@okampus/api/dal';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import SentryTracing from '@sentry/tracing';

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
import type { Snowflake } from '@okampus/shared/types';

const sessionKey = Buffer.from(config.session.secret, 'ascii').subarray(0, 32);

const defaultCsp = { contentSecurityPolicy: false, crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false };
const defaultStoreValues = { requester: null, tenant: null, gqlInfo: null, alreadyPopulated: false };

const authenticateOptions = { authInfo: false, successRedirect: '/auth/oidc-callback' };

const transformOptions = { enableImplicitConversion: true };
const validationPipeOptions = { transform: true, transformOptions, forbidNonWhitelisted: true, whitelist: true };

export async function bootstrap(logger: Logger): Promise<INestApplication> {
  if (config.sentry.enabled) SentryTracing.addExtensionMethods();

  const fastifyInstance = fastify({ trustProxy: false });
  fastifyInstance.addHook('preValidation', uploadPreValidation);

  await fastifyInstance.register(fastifyCookie, { secret: config.cookies.signature });
  await fastifyInstance.register(fastifySecureSession, { key: sessionKey, cookie: { path: '/', httpOnly: true } });
  await fastifyInstance.register(fastifyPassport.initialize());
  await fastifyInstance.register(fastifyPassport.secureSession());
  await fastifyInstance.register(fastifyMulter.contentParser);
  await fastifyInstance.register(fastifyCors, { origin: corsValidation, credentials: true });
  await fastifyInstance.register(fastifyRequestContext, { hook: 'preValidation', defaultStoreValues });

  // @ts-expect-error - @nestjs/platform-fastify is not up to date with fastify 4.13.0
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastifyInstance));

  const oidcCache = app.get<OIDCCacheService>(OIDCCacheService);
  const tenantCoreRepository = app.get<TenantCoreRepository>(TenantCoreRepository);
  const usersService = app.get<UsersService>(UsersService);

  fastifyPassport.registerUserSerializer(async (user: { id: Snowflake }) => user.id);
  fastifyPassport.registerUserDeserializer(async (id: Snowflake) => await usersService.findBareById(id));

  const preValidationContext = { tenantCoreRepository, oidcCache, usersService, fastifyInstance, fastifyPassport };

  const tenantStrategyPreValidation = tenantStrategyValidation(preValidationContext);
  fastifyInstance.get('/auth/:domain', { preValidation: tenantStrategyPreValidation }, () => ({}));

  const tenantCallbackPreValidation = tenantCallbackValidation({ ...preValidationContext, authenticateOptions });
  fastifyInstance.get('/auth/:tenant/callback', { preValidation: tenantCallbackPreValidation }, () => ({}));

  app.enableShutdownHooks();
  app.use(helmet(config.env.isProd() ? {} : defaultCsp));
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  if (!config.s3.enabled)
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
