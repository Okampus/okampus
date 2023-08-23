import { RedisService } from '../cache/redis.service';
import { UploadsService } from '../../global/uploads/uploads.service';
import { MeiliSearchService } from '../search/meilisearch.service';
import { loadConfig } from '../../shards/utils/load-config';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

import { HealthCheckService, MemoryHealthIndicator, MikroOrmHealthIndicator, HealthCheck } from '@nestjs/terminus';

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@okampus/api/shards';
import { toKebabCase } from '@okampus/shared/utils';
import { BucketNames } from '@okampus/shared/enums';

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
    private readonly meilisearchService: MeiliSearchService,
    private readonly database: MikroOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {
    // S3 storage
    this.healthChecks.push(async () => {
      const buckets = Object.values(BucketNames);
      const customBucketNames = loadConfig(this.configService, 's3.bucketNames');

      const command = new ListBucketsCommand({});
      const exists = await this.uploadService.s3Client.send(command);

      const result: HealthIndicatorResult = { s3: { status: 'down' } };
      if (!exists.Buckets) return result;

      result.s3.status = 'up';
      for (const bucket of buckets) {
        const customName = customBucketNames[bucket];
        const status = exists.Buckets?.some(({ Name }) => Name === customName) ? 'up' : 'down';
        result.s3[toKebabCase(bucket)] = { status };
      }

      return result;
    });

    this.healthChecks.push(
      () => this.redisService.checkHealth('cache'),
      () => this.meilisearchService.checkHealth('meilisearch'),
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
