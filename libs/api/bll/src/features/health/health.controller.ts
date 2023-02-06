import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '@okampus/api/shards';

import type { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import type {
  HealthCheckResult,
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import type Redis from 'ioredis';
import type { ConfigService } from '../../global/config.module';

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
      path: this.configService.config.upload.localPath,
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
