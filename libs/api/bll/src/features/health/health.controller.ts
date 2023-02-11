// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../global/config.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RedisService } from '../../global/redis.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../upload/upload.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MeiliSearchService } from '../search/meilisearch.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  HealthCheckService,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '@okampus/api/shards';
import { S3Buckets } from '@okampus/shared/enums';

import type { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  checkStorageHealth: (() => Promise<HealthIndicatorResult>) | (() => Promise<HealthIndicatorResult>)[];

  constructor(
    private readonly health: HealthCheckService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly uploadService: UploadService,
    private readonly disk: DiskHealthIndicator,
    private readonly meilisearchService: MeiliSearchService,
    private readonly database: MikroOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {
    const config = this.configService.config;
    this.checkStorageHealth = config.s3.enabled
      ? Object.values(S3Buckets).map((bucket) => {
          return async () => {
            if (!this.uploadService.minioClient) {
              return { [`s3-${bucket}`]: { status: 'down' } } as HealthIndicatorResult;
            }

            let bucketExists = false;
            try {
              bucketExists = await this.uploadService.minioClient.bucketExists(bucket);
              return { [`s3-${bucket}`]: { status: bucketExists ? 'up' : 'down' } } as HealthIndicatorResult;
            } catch {
              return { [`s3-${bucket}`]: { status: 'down' } } as HealthIndicatorResult;
            }
          };
        })
      : () => this.disk.checkStorage('disk', { path: config.upload.localPath, thresholdPercent: 0.75 });
  }

  @Get()
  @Public()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    const MAX_HEAP_SIZE = 500 * 1024 * 1024;

    return await this.health.check(
      [
        () => this.redisService.checkHealth('cache'),
        this.checkStorageHealth,
        () => this.meilisearchService.checkHealth('search'),
        () => this.database.pingCheck('database'),
        () => this.memory.checkHeap('memory', MAX_HEAP_SIZE),
      ].flat()
    );
  }
}
