import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class MikroOrmHealthIndicator extends HealthIndicator {
  constructor(
    private readonly orm: MikroORM,
  ) { super(); }

  public async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.orm.em.getConnection().execute('SELECT 1').catch(() => false);
    const result = this.getStatus(key, Boolean(isHealthy));

    if (isHealthy)
      return result;

    throw new HealthCheckError('Database check failed', result);
  }
}
