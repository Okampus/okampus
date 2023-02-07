// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../global/config.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RedisService } from '../../global/redis.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MinioService } from '../../global/minio.module';

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '@okampus/api/shards';

import { S3Buckets } from '@okampus/shared/enums';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import type { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  checkStorageHealth: (() => Promise<HealthIndicatorResult>) | (() => Promise<HealthIndicatorResult>)[];

  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly redisService: RedisService,
    private readonly database: MikroOrmHealthIndicator,
    // private readonly meilisearch: MeiliSearchHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly minio: MinioService
  ) {
    const config = this.configService.config;
    this.checkStorageHealth = config.s3.enabled
      ? Object.values(S3Buckets).map((bucket) => () => this.minio.checkHealth('storage', bucket))
      : () => this.disk.checkStorage('disk', { path: config.upload.localPath, thresholdPercent: 0.75 });
  }

  @Get()
  @Public()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    const MAX_HEAP_SIZE = 500 * 1024 * 1024;

    return await this.health.check(
      [
        () => this.database.pingCheck('database'),
        () => this.redisService.checkHealth('cache'),
        () => this.memory.checkHeap('memory', MAX_HEAP_SIZE),
        this.checkStorageHealth,
      ].flat()
    );
  }
}
