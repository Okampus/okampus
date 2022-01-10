import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Public } from '../shared/lib/decorators/public.decorator';
import { MikroOrmHealthIndicator } from '../shared/modules/health/mikro-orm.health';
import { TypesenseHealthIndicator } from '../shared/modules/health/typesense.health';

@ApiTags('Heath')
@Controller({ path: 'health' })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly database: MikroOrmHealthIndicator,
    private readonly typesense: TypesenseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  public async check(): Promise<HealthCheckResult> {
    return await this.health.check([
      async (): Promise<HealthIndicatorResult> => this.http.pingCheck('api', 'https://api.horizon-efrei.fr'),
      async (): Promise<HealthIndicatorResult> => this.http.pingCheck('site', 'https://horizon-efrei.fr'),
      async (): Promise<HealthIndicatorResult> => this.database.pingCheck('database'),
      async (): Promise<HealthIndicatorResult> => this.typesense.pingCheck('instant-search'),
    ]);
  }
}
