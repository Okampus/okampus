import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { client } from '../../../typesense.config';

@Injectable()
export class TypesenseHealthIndicator extends HealthIndicator {
  public async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const response = await client.health.retrieve().catch(error => error);
    const isHealthy = response?.status === 'ok' || response?.ok === true;
    const result = this.getStatus(key, isHealthy);

    if (isHealthy)
      return result;

    throw new HealthCheckError('Database check failed', result);
  }
}
