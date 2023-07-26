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
  constructor(private readonly configService: ConfigService) {}

  public async onModuleInit(): Promise<void> {
    const { mkdir } = promises;
    const logger = new Logger(UploadsModule.name);

    if (loadConfig<boolean>(this.configService, 's3.isEnabled')) {
      logger.log(`Distant storage is enabled, uploading to ${loadConfig<string>(this.configService, 's3.endpoint')}`);
    } else {
      const uploadPath = loadConfig<string>(this.configService, 'upload.localPath');

      logger.log(`Distant storage is disabled, uploading to local file system. ${uploadPath}`);
      const makeDir = (dir: string) => mkdir(dir, { recursive: true });
      await Promise.all(Object.keys(Buckets).map((value) => makeDir(path.join(uploadPath, value))));
    }
  }
}
