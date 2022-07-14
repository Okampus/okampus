// Hack to get Multer to register its typings into the global scope, because why not
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780#issuecomment-790684085
import 'multer';

import path from 'node:path';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as SentryTracing from '@sentry/tracing';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { computedConfig, config } from './shared/configs/config';
import { client } from './shared/configs/typesense.config';
import { logger as loggerMiddleware } from './shared/lib/middlewares/logger.middleware';

const logger = new Logger('Bootstrap');

async function attemptTypesenseConnection(): Promise<void> {
  const typesenseLogger = new Logger('Typesense');
  try {
    await client.health.retrieve();
    typesenseLogger.log('Connection established');
  } catch (err) {
    if (err?.code === 'ECONNREFUSED') {
      config.set('typesense.enabled', false);
      typesenseLogger.warn('Service not available, disabling');
    } else {
      throw err;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setupSwagger(app: NestExpressApplication): void {
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
  await attemptTypesenseConnection();

  if (config.get('sentry.enabled'))
    SentryTracing.addExtensionMethods();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.use(express.json());
  if (config.get('enableHelmet'))
    app.use(helmet());
  app.use(loggerMiddleware);
  app.use(cookieParser(config.get('cookies.signature')));

  app.enableCors({ origin: computedConfig.frontendUrl, credentials: true });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
    whitelist: true,
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (!config.get('storage.enabled')) {
    app.useStaticAssets(
      path.join(path.resolve('./'), config.get('upload.path')),
      { prefix: '/uploads' },
    );
  }

  app.set('trust proxy', false);

  // FIXME: re-enable swagger when @nestjs/swagger is fixed
  // See https://github.com/nestjs/swagger/issues/1979
  // setupSwagger(app);

  await app.listen(config.get('port'));
  const url = await app.getUrl();
  logger.log(`API running on: ${url.replace('[::1]', 'localhost')}`);
}

void bootstrap();
