import { ConfigModule } from './config.module';
import { Global, Injectable, Module } from '@nestjs/common';
import { Client } from 'minio';
import type { ClientOptions } from 'minio';
import type { ConfigService } from './config.module';

// Singleton class
class Minio extends Client {
  private static instance: Minio;

  constructor(options: ClientOptions) {
    if (Minio.instance) return Minio.instance;

    super(options);
    Minio.instance = this;
  }
}

@Injectable()
export class MinioService extends Minio {
  constructor(configService: ConfigService) {
    const config = configService.config;
    super({
      endPoint: config.s3.endpoint,
      accessKey: config.s3.accessKeyId,
      secretKey: config.s3.secretAccessKey,
      region: config.s3.region,
    });
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
