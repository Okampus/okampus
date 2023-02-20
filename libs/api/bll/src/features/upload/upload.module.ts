import { UploadService } from './upload.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../global/config.module';

import { Global } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { S3Buckets } from '@okampus/shared/enums';

import { promises } from 'node:fs';
import path from 'node:path';
import type { OnModuleInit } from '@nestjs/common';

@Global()
@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  public async onModuleInit(): Promise<void> {
    const { mkdir } = promises;
    const logger = new Logger('Upload');

    if (this.configService.config.s3.enabled) {
      logger.log(`Distant storage is enabled, uploading to ${this.configService.config.s3.endpoint}`);
      return;
    }

    logger.log('Distant storage is disabled, uploading to local file system.');
    const base = this.configService.config.upload.localPath;

    await Promise.all(Object.keys(S3Buckets).map((value) => mkdir(path.join(base, value), { recursive: true })));
  }
}
