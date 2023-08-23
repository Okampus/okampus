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
import fastifyRequestContext, { requestContext } from '@fastify/request-context';
import fastifyPassport from '@fastify/passport';
import fastifyCors from '@fastify/cors';

import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { INestApplication, Logger } from '@nestjs/common';
import type { User } from '@okampus/api/dal';

const sessionKey = Buffer.from(config.session.secret, 'ascii').subarray(0, 32);

const defaultCsp = { contentSecurityPolicy: false, crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false };
const defaultStoreValues = { requester: undefined, tenant: undefined, token: undefined };

const transformOptions = { enableImplicitConversion: true };
const validationPipeOptions = { transform: true, transformOptions, forbidNonWhitelisted: true, whitelist: true };

export async function bootstrap(logger: Logger): Promise<INestApplication> {
  const fastifyInstance = fastify({ trustProxy: false });
  fastifyInstance.addHook('preValidation', uploadPreValidation);

  await fastifyInstance.register(fastifyCookie, {
    // Disable signed cookies for now, as JWTs are already signed (Hasura doesn't support signed cookies)
    secret: { sign: (value) => value, unsign: (value) => ({ valid: true, renew: false, value }) },
  });

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

  const tenantCallbackPreValidation = tenantCallbackValidation(preValidationContext);

  fastifyInstance.get('/auth/:oidcName/callback', { preValidation: tenantCallbackPreValidation }, async (req, res) => {
    const { validationError, user, params } = req;
    if (validationError || !user) {
      const { oidcName } = params as { oidcName: string };
      const tenant = await authService.findTenantByOidcName(oidcName);
      return res.redirect(303, `https://${tenant.domain}.okampus.fr/signin`);
    }

    const { id, tenantScope } = user as User;
    requestContext.set('requester', user as User);
    requestContext.set('tenant', tenantScope);

    await authService.refreshSession(req, res, id);
    res.redirect(303, `https://${tenantScope.domain}.okampus.fr`);
  });

  app.enableShutdownHooks();
  app.use(helmet(config.env.isProd() ? {} : defaultCsp));
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

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
