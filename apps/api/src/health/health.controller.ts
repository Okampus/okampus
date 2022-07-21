import path from 'node:path';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { computedConfig, config } from '../shared/configs/config';
import { Public } from '../shared/lib/decorators/public.decorator';
import { MikroOrmHealthIndicator } from '../shared/modules/health/mikro-orm.health';
import { StorageHealthIndicator } from '../shared/modules/health/storage.health';
import { TypesenseHealthIndicator } from '../shared/modules/health/typesense.health';

@ApiTags('Heath')
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
    const MAX_HEAP_SIZE = 500 * 1024 * 1024;
    const LOCAL_STORAGE_OPTIONS = {
      path: path.join(path.resolve('./'), config.get('upload.path')),
      thresholdPercent: 0.75,
    };

    /* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/promise-function-async */
    return await this.health.check([
      () => this.http.pingCheck('api', computedConfig.apiUrl, HTTP_TIMEOUT),
      () => this.http.pingCheck('site', computedConfig.frontendUrl, HTTP_TIMEOUT),
      () => this.redis.checkHealth('cache', { type: 'redis', client: this.redisClient }),
      () => this.database.pingCheck('database'),
      () => this.typesense.pingCheck('search'),
      async (): Promise<HealthIndicatorResult> => this.memory.checkHeap('memory', MAX_HEAP_SIZE),
      ...(config.get('storage.enabled') ? [
        async (): Promise<HealthIndicatorResult> => this.storage.pingCheck('storage', 'profile-images'),
        async (): Promise<HealthIndicatorResult> => this.storage.pingCheck('storage', 'attachments'),
        async (): Promise<HealthIndicatorResult> => this.storage.pingCheck('storage', 'documents'),
      ] : [
        async (): Promise<HealthIndicatorResult> => this.disk.checkStorage('disk', LOCAL_STORAGE_OPTIONS),
      ]),
    ]);
  }
}
