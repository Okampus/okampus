import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
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
  app.use(logger);
  app.use(cookieParser(config.get('cookieSignature')));

  app.enableCors({ origin: true, credentials: true });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
    whitelist: true,
  }));
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.set('trust proxy', false);

  await app.listen(config.get('port'));
  Logger.log(`Server initialized on port ${config.get('port')}`, 'Bootstrap');
}

void bootstrap();
