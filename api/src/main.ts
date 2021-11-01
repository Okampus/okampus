import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from './config';
import { ExceptionsFilter } from './shared/filters/exceptions.filter';
import { logger } from './shared/middlewares/logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(cookieParser(config.get('cookieSignature')));

  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: true }));
  app.useGlobalFilters(new ExceptionsFilter());
  app.set('trust proxy', false);

  app.use(logger);

  await app.listen(config.get('port'));
  Logger.log(`Server initialized on port ${config.get('port')}`, 'Bootstrap');
}

void bootstrap();
