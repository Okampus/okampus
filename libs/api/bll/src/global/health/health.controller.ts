import { RedisService } from '../cache/redis.service';
import { UploadsService } from '../../global/uploads/uploads.service';
import { MeiliSearchService } from '../search/meilisearch.service';
import { loadConfig } from '../../shards/utils/load-config';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

import {
  HealthCheckService,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@okampus/api/shards';
import { toKebabCase } from '@okampus/shared/utils';

import type { HealthCheckResult, HealthIndicatorResult, HealthIndicatorFunction } from '@nestjs/terminus';

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
    private readonly memory: MemoryHealthIndicator,
  ) {
    if (this.configService.get('redis.isEnabled')) this.healthChecks.push(() => this.redisService.checkHealth('cache'));

    if (this.configService.get('meilisearch.isEnabled'))
      this.healthChecks.push(() => this.meilisearchService.checkHealth('meilisearch'));

    // S3 storage or local storage
    if (this.configService.get('s3.isEnabled')) {
      const bucketNames = loadConfig(this.configService, 's3.buckets');
      this.healthChecks.push(async () => {
        const result: HealthIndicatorResult = { s3: { status: 'down' } };
        const buckets = Object.values(bucketNames);

        if (this.uploadService.s3Client) {
          const command = new ListBucketsCommand({});
          const exists = await this.uploadService.s3Client.send(command);

          if (!exists.Buckets) return result;

          result.s3.status = 'up';
          for (const bucket of buckets) {
            const status = exists.Buckets?.some(({ Name }) => Name === bucket) ? 'up' : 'down';
            result.s3[toKebabCase(bucket)] = { status };
          }

          return result;
        }

        return result;
      });
    } else {
      const path = loadConfig(this.configService, 'upload.localPath');
      this.healthChecks.push(() => this.disk.checkStorage('disk', { path, thresholdPercent: 0.75 }));
    }

    this.healthChecks.push(
      () => this.database.pingCheck('database'),
      () => this.memory.checkHeap('memory', 500 * 1024 * 1024), // 500MB max heap size
    );
  }

  @Get()
  @Public()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return await this.health.check(this.healthChecks);
  }
}
