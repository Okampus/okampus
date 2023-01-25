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
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { ConfigService } from '../../global/config.module';
import { Public } from '@okampus/api/shards';

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly redis: RedisHealthIndicator,
    private readonly database: MikroOrmHealthIndicator,
    // private readonly meilisearch: MeiliSearchHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    // private readonly storage: StorageHealthIndicator,

    @InjectRedis() private readonly redisClient: Redis
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    const REDIS_OPTIONS = { type: 'redis', client: this.redisClient } as const;
    const MAX_HEAP_SIZE = 500 * 1024 * 1024;
    const _LOCAL_STORAGE_OPTIONS = {
      path: path.join(path.resolve('./'), this.configService.config.upload.path),
      thresholdPercent: 0.75,
    };

    const _BUCKETS = [...new Set(Object.values(this.configService.config.s3.buckets))];

    return await this.health.check(
      [
        () => this.database.pingCheck('database'),
        // () => this.meilisearch.pingCheck('meilisearch'),
        () => this.redis.checkHealth('cache', REDIS_OPTIONS),
        () => this.memory.checkHeap('memory', MAX_HEAP_SIZE),
        // this.configService.config.s3.enabled
        //   ? BUCKETS.map((bucket) => () => this.storage.pingCheck('storage', bucket))
        //   : () => this.disk.checkStorage('disk', LOCAL_STORAGE_OPTIONS),
      ].flat()
    );
  }
}
