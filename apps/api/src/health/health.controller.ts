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
import { computedConfig, config } from '../shared/configs/config';
import { Public } from '../shared/lib/decorators/public.decorator';
import { StorageHealthIndicator } from '../shared/modules/health/storage.health';
import { TypesenseHealthIndicator } from '../shared/modules/health/typesense.health';

@ApiTags('Health')
@Controller({ path: 'health' })
export class HealthController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly database: MikroOrmHealthIndicator,
    private readonly typesense: TypesenseHealthIndicator,
    private readonly storage: StorageHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,

    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  public async check(): Promise<HealthCheckResult> {
    const HTTP_TIMEOUT = { timeout: 2000 };
    const REDIS_OPTIONS = { type: 'redis', client: this.redisClient } as const;
    const MAX_HEAP_SIZE = 500 * 1024 * 1024;
    const LOCAL_STORAGE_OPTIONS = {
      path: path.join(path.resolve('./'), config.get('upload.path')),
      thresholdPercent: 0.75,
    };

    /* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/promise-function-async */
    return await this.health.check([
      () => this.http.pingCheck('api', computedConfig.apiUrl, HTTP_TIMEOUT),
      () => this.http.pingCheck('site', computedConfig.frontendUrl, HTTP_TIMEOUT),
      () => this.redis.checkHealth('cache', REDIS_OPTIONS),
      () => this.database.pingCheck('database'),
      () => this.typesense.pingCheck('search'),
      () => this.memory.checkHeap('memory', MAX_HEAP_SIZE),
      ...(config.get('s3.enabled') ? [
        () => this.storage.pingCheck('storage', config.get('s3.buckets.attachments')),
        () => this.storage.pingCheck('storage', config.get('s3.buckets.documents')),
        () => this.storage.pingCheck('storage', config.get('s3.buckets.profileImages')),
        () => this.storage.pingCheck('storage', config.get('s3.buckets.teamFiles')),
      ] : [
        () => this.disk.checkStorage('disk', LOCAL_STORAGE_OPTIONS),
      ]),
    ]);
  }
}
