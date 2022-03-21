import path from 'node:path';
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
    private readonly database: MikroOrmHealthIndicator,
    private readonly typesense: TypesenseHealthIndicator,
    private readonly storage: StorageHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
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

    return await this.health.check([
      async (): Promise<HealthIndicatorResult> => this.http.pingCheck('api', computedConfig.apiUrl, HTTP_TIMEOUT),
      async (): Promise<HealthIndicatorResult> => this.http.pingCheck('site', computedConfig.frontendUrl, HTTP_TIMEOUT),
      async (): Promise<HealthIndicatorResult> => this.database.pingCheck('database'),
      async (): Promise<HealthIndicatorResult> => this.typesense.pingCheck('search'),
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
