import { UploadService } from './upload.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../global/config.module';

import { Global } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { S3Buckets } from '@okampus/shared/enums';
import { enumKeys } from '@okampus/shared/utils';

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
    const logger = new Logger('Files');

    if (this.configService.config.s3.enabled) {
      logger.log(`Distant storage is enabled, uploading to ${this.configService.config.s3.endpoint}`);
      return;
    }

    logger.log('Distant storage is disabled, uploading to local file system.');
    const base = this.configService.config.upload.localPath;

    const dirs: Array<Promise<string | undefined>> = [];
    for (const value of enumKeys(S3Buckets)) dirs.push(mkdir(path.join(base, S3Buckets[value]), { recursive: true }));

    await Promise.all(dirs);
  }
}
