import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class MikroOrmHealthIndicator extends HealthIndicator {
  constructor(
    private readonly em: EntityManager,
  ) { super(); }

  public async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.em.getConnection().execute('SELECT 1').catch(() => false);
    const result = this.getStatus(key, Boolean(isHealthy));

    if (isHealthy)
      return result;

    throw new HealthCheckError('Database check failed', result);
  }
}
