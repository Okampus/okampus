// Hack to get Multer to register its typings into the global scope, because why not
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780#issuecomment-790684085
import 'multer';
import './shared/lib/morgan.register';

import path from 'node:path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as SentryTracing from '@sentry/tracing';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { computedConfig, config } from './shared/configs/config';
import { meiliSearchClient } from './shared/configs/meilisearch.config';

const logger = new Logger('Bootstrap');

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
  if (config.get('meilisearch.enabled') && !await meiliSearchClient.isHealthy()) {
    logger.error('MeiliSearch is not healthy and has been disabled!');
    config.set('meilisearch.enabled', false);
  }

  if (config.get('sentry.enabled'))
    SentryTracing.addExtensionMethods();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (config.get('nodeEnv') === 'production') {
    app.use(helmet());
  } else {
    // Disable those rules to make the GraphQL playground work
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
  }
  app.use(cookieParser(config.get('cookies.signature')));

  app.enableCors({ origin: computedConfig.frontendUrl, credentials: true });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
    whitelist: true,
  }));

  if (!config.get('s3.enabled')) {
    app.useStaticAssets(
      path.join(path.resolve('./'), config.get('upload.path')),
      { prefix: '/uploads' },
    );
  }

  app.set('trust proxy', false);

  setupSwagger(app);

  await app.listen(config.get('port'));
  const url = await app.getUrl();
  logger.log(`API running on: ${url.replace('[::1]', 'localhost')}`);
}

void bootstrap();
