import { UploadsService } from './uploads.service';
import { UploadsResolver } from './uploads.resolver';
import { loadConfig } from '../../shards/utils/load-config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraModule } from '../../global/graphql/hasura.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Logger, Module } from '@nestjs/common';

import { Buckets } from '@okampus/shared/enums';

import { promises } from 'node:fs';
import path from 'node:path';

import type { OnModuleInit } from '@nestjs/common';

@Global()
@Module({
  imports: [ConfigModule, HasuraModule],
  providers: [UploadsService, UploadsResolver],
  exports: [UploadsService],
})
export class UploadsModule implements OnModuleInit {
  isEnabled: boolean;
  s3EndPoint: string;
  uploadLocalPath: string;
  constructor(private readonly configService: ConfigService) {
    this.isEnabled = loadConfig<boolean>(this.configService, 's3.isEnabled');
    this.s3EndPoint = loadConfig<string>(this.configService, 's3.endPoint');
    this.uploadLocalPath = loadConfig<string>(this.configService, 'upload.localPath');
  }

  public async onModuleInit(): Promise<void> {
    const { mkdir } = promises;
    const logger = new Logger(UploadsModule.name);

    if (this.isEnabled) {
      logger.log(`Distant storage is enabled, uploading to ${this.s3EndPoint}`);
    } else {
      logger.log(`Distant storage is disabled, uploading to local file system. ${this.uploadLocalPath}`);
      const makeDir = (dir: string) => mkdir(dir, { recursive: true });
      await Promise.all(Object.keys(Buckets).map((value) => makeDir(path.join(this.uploadLocalPath, value))));
    }
  }
}
