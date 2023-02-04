import { UploadService } from './upload.service';
import { Global } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { S3Buckets } from '@okampus/shared/enums';
import { enumKeys } from '@okampus/shared/utils';
import { promises } from 'node:fs';
import path from 'node:path';
import type { OnModuleInit } from '@nestjs/common';
import type { ConfigService } from '../../global/config.module';
import type { ApiConfig } from '@okampus/shared/types';

@Global()
@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule implements OnModuleInit {
  private readonly config: ApiConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.config;
  }

  public async onModuleInit(): Promise<void> {
    const { mkdir } = promises;
    const logger = new Logger('Files');

    if (this.config.s3.enabled) {
      logger.log(`Distant storage is enabled, uploading to ${this.config.s3.endpoint}`);
      return;
    }

    logger.log('Distant storage is disabled, uploading to local file system.');
    const base = path.join(__dirname, '..', '..', '..', 'apps/api', this.config.upload.path);

    const dirs: Array<Promise<string | undefined>> = [];
    for (const value of enumKeys(S3Buckets)) dirs.push(mkdir(path.join(base, S3Buckets[value]), { recursive: true }));

    await Promise.all(dirs);
  }
}
