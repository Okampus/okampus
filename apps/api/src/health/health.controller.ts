import path from 'node:path';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { config } from '../shared/configs/config';
import { Public } from '../shared/lib/decorators/public.decorator';
import { MeiliSearchHealthIndicator } from '../shared/modules/health/meilisearch.health';
import { StorageHealthIndicator } from '../shared/modules/health/storage.health';

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly database: MikroOrmHealthIndicator,
    private readonly meilisearch: MeiliSearchHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly storage: StorageHealthIndicator,

    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    const REDIS_OPTIONS = { type: 'redis', client: this.redisClient } as const;
    const MAX_HEAP_SIZE = 500 * 1024 * 1024;
    const LOCAL_STORAGE_OPTIONS = {
      path: path.join(path.resolve('./'), config.upload.path),
      thresholdPercent: 0.75,
    };

    const BUCKETS = [...new Set(Object.values(config.s3.buckets))];
    /* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/promise-function-async */
    return await this.health.check([
      () => this.database.pingCheck('database'),
      () => this.meilisearch.pingCheck('meilisearch'),
      () => this.redis.checkHealth('cache', REDIS_OPTIONS),
      () => this.memory.checkHeap('memory', MAX_HEAP_SIZE),
      config.s3.enabled
        ? BUCKETS.map(bucket => () => this.storage.pingCheck('storage', bucket))
        : () => this.disk.checkStorage('disk', LOCAL_STORAGE_OPTIONS),
    ].flat());
  }
}
