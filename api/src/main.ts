import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from './config';
import { ExceptionsFilter } from './shared/filters/exceptions.filter';
import { logger } from './shared/middlewares/logger';
import { FileKind } from './shared/types/file-kind.enum';

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(Number(k))) as K[];
}

async function createFileStructure(): Promise<void> {
  const base = path.join(path.resolve('./'), 'uploads');
  for (const value of enumKeys(FileKind))
    await fs.mkdir(path.join(base, FileKind[value]), { recursive: true });
}

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

  await createFileStructure();
  await app.listen(config.get('port'));
  Logger.log(`Server initialized on port ${config.get('port')}`, 'Bootstrap');
}

void bootstrap();
