// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RedisService } from '../cache/redis.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadsService } from '../../features/uploads/uploads.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MeiliSearchService } from '../search/meilisearch.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { loadConfig } from '../../shards/utils/load-config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
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
import { toKebabCase } from '@okampus/shared/utils';

import { Buckets } from '@okampus/shared/enums';

import type { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

import type { ApiConfig } from '@okampus/shared/types';

function getBucketStatus(bucket: string, isOk: boolean): HealthIndicatorResult {
  return { [`s3-${toKebabCase(bucket)}`]: { status: isOk ? 'up' : 'down' } };
}

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  healthChecks: HealthIndicatorFunction[] = [];

  constructor(
    private readonly health: HealthCheckService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly uploadService: UploadsService,
    private readonly disk: DiskHealthIndicator,
    private readonly meilisearchService: MeiliSearchService,
    private readonly database: MikroOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {
    if (this.configService.get('redis.isEnabled')) this.healthChecks.push(() => this.redisService.checkHealth('cache'));

    if (this.configService.get('meilisearch.isEnabled'))
      this.healthChecks.push(() => this.meilisearchService.checkHealth('meilisearch'));

    // S3 storage or local storage
    if (this.configService.get('s3.isEnabled')) {
      const bucketNames = loadConfig<ApiConfig['s3']['buckets']>(this.configService, 's3.buckets');
      this.healthChecks.push(
        ...Object.values(Buckets).map((bucket) => {
          return async () => {
            if (!this.uploadService.minioClient) return getBucketStatus(bucket, false);
            return await this.uploadService.minioClient
              .bucketExists(bucketNames[bucket])
              .then((exists) => getBucketStatus(bucket, exists))
              .catch(() => getBucketStatus(bucket, false));
          };
        })
      );
    } else {
      const path = loadConfig<string>(this.configService, 'upload.localPath');
      this.healthChecks.push(() => this.disk.checkStorage('disk', { path, thresholdPercent: 0.75 }));
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
