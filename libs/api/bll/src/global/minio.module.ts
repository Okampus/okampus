import { Global, Injectable, Module } from '@nestjs/common';
import { Client } from 'minio';
import type { DynamicModule } from '@nestjs/common';
import type { ClientOptions } from 'minio';

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
  constructor(options: ClientOptions) {
    super(options);
  }
}

@Global()
@Module({})
export class MinioModule {
  static forRoot(options: ClientOptions): DynamicModule {
    const minioProvider = {
      provide: MinioService,
      useValue: new MinioService(options),
    };

    return {
      module: MinioModule,
      providers: [minioProvider],
      exports: [minioProvider],
    };
  }
}
