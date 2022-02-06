import path from 'node:path';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { computedConfig, config } from './shared/configs/config';
import { client } from './shared/configs/typesense.config';
import { ExceptionsFilter } from './shared/lib/filters/exceptions.filter';
import { TypesenseFilter } from './shared/lib/filters/typesense.filter';
import { logger as loggerMiddleware } from './shared/lib/middlewares/logger.middleware';

const logger = new Logger('Bootstrap');

async function attemptTypesenseConnection(): Promise<void> {
  const typesenseLogger = new Logger('Typesense');
  try {
    await client.health.retrieve();
    typesenseLogger.log('Connection established');
  } catch (err) {
    if (err?.code === 'ECONNREFUSED') {
      config.set('typesenseEnabled', false);
      typesenseLogger.warn('Service not available, disabling');
    } else {
      throw err;
    }
  }
}

function setupSwagger(app: NestExpressApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Horizon Web API')
    .setDescription('REST API for HorizonWeb')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  logger.log('Documentation available at /docs');
}

async function bootstrap(): Promise<void> {
  await attemptTypesenseConnection();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(loggerMiddleware);
  app.use(cookieParser(config.get('cookieSignature')));
  // TODO: Use redis for session storage, and ensure they are used only for the initial myEfrei login
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors({ origin: computedConfig.frontendUrl, credentials: true });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
    whitelist: true,
  }));
  app.useGlobalFilters(new ExceptionsFilter(), new TypesenseFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (!config.get('distantStorageEnabled')) {
    app.useStaticAssets(
      path.join(path.resolve('./'), config.get('uploadPath')),
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
