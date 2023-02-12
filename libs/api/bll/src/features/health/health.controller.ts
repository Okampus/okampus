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
  HealthIndicatorFunction,
} from '@nestjs/terminus';

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '@okampus/api/shards';
import { kebabize } from '@okampus/shared/utils';

import { S3Buckets } from '@okampus/shared/enums';
import type { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

function getBucketStatus(bucket: string, isOk: boolean): HealthIndicatorResult {
  return { [`s3-${kebabize(bucket)}`]: { status: isOk ? 'up' : 'down' } };
}

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  healthChecks: HealthIndicatorFunction[] = [];

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

    if (config.redis.enabled) this.healthChecks.push(() => this.redisService.checkHealth('cache'));
    if (config.meilisearch.enabled) this.healthChecks.push(() => this.meilisearchService.checkHealth('meilisearch'));

    // S3 storage or local storage
    if (config.s3.enabled) {
      this.healthChecks.push(
        ...Object.values(S3Buckets).map((bucket) => {
          return async () => {
            if (!this.uploadService.minioClient) return getBucketStatus(bucket, false);
            return await this.uploadService.minioClient
              .bucketExists(config.s3.buckets[bucket])
              .then((exists) => getBucketStatus(bucket, exists))
              .catch(() => getBucketStatus(bucket, false));
          };
        })
      );
    } else {
      this.healthChecks.push(() =>
        this.disk.checkStorage('disk', { path: config.upload.localPath, thresholdPercent: 0.75 })
      );
    }

    this.healthChecks.push(
      () => this.database.pingCheck('database'),
      () => this.memory.checkHeap('memory', 500 * 1024 * 1024) // 500MB max heap size
    );
  }

  @Get()
  @Public()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return await this.health.check(this.healthChecks);
  }
}
