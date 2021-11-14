import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from './config';
import { ExceptionsFilter } from './shared/lib/filters/exceptions.filter';
import { logger } from './shared/lib/middlewares/logger.middleware';
import { FileKind } from './shared/lib/types/file-kind.enum';
import { enumKeys } from './shared/lib/utils/enumKeys';

async function createFileStructure(): Promise<void> {
  const base = path.join(path.resolve('./'), 'uploads');

  const dirs: Array<Promise<string | undefined>> = [];
  for (const value of enumKeys(FileKind))
    dirs.push(fs.mkdir(path.join(base, FileKind[value]), { recursive: true }));

  await Promise.all(dirs);
}

function setupSwagger(app: NestExpressApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Horizon Web API')
    .setDescription('REST API for HorizonWeb')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
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
  setupSwagger(app);

  await app.listen(config.get('port'));
  Logger.log(`API running on: ${(await app.getUrl()).replace('[::1]', 'localhost')}`, 'Bootstrap');
}

void bootstrap();
