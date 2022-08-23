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
import type { Request } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from './shared/configs/config';

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
  if (config.sentry.enabled)
    SentryTracing.addExtensionMethods();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (config.env.isProd()) {
    app.enableCors((req: Request, cb) => {
      const callback = cb as (err: Error | null, result: { origin: boolean; credentials: boolean }) => void;
      const origin = req.header('origin');
      callback(null,
        {
          origin: origin ? /^https:\/\/(?:[\dA-Za-z][\dA-Za-z-]{1,61}[\dA-Za-z])+\.okampus\.fr$/.test(origin) : false,
          credentials: true,
        });
    });
    app.use(helmet());
  } else {
    app.enableCors({ origin: config.network.frontendUrl, credentials: true });
    // Disable those rules to make the GraphQL playground work
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
  }
  app.use(cookieParser(config.cookies.signature));


  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
    whitelist: true,
  }));

  if (!config.s3.enabled) {
    app.useStaticAssets(
      path.join(path.resolve('./'), config.upload.path),
      { prefix: '/uploads' },
    );
  }

  app.set('trust proxy', false);

  setupSwagger(app);

  await app.listen(config.network.port);
  const url = await app.getUrl();
  logger.log(`API running on: ${url.replace('[::1]', 'localhost')}`);
}

void bootstrap();
