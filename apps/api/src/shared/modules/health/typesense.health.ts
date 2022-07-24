import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator, TimeoutError } from '@nestjs/terminus';
import { promiseTimeout, TimeoutError as PromiseTimeoutError } from '@nestjs/terminus/dist/utils';
import type { HealthResponse } from 'typesense/lib/Typesense/Health';
import { client } from '../../configs/typesense.config';

interface TypesenseHealthIndicatorOptions {
  timeout?: number;
}

@Injectable()
export class TypesenseHealthIndicator extends HealthIndicator {
  public async pingCheck(key: string, options?: TypesenseHealthIndicatorOptions): Promise<HealthIndicatorResult> {
    const timeout = options?.timeout ?? 1000;

    try {
      await this.pingTypesense(timeout);
    } catch (error) {
      if (error instanceof PromiseTimeoutError) {
        throw new TimeoutError(
          timeout,
          this.getStatus(key, false, { message: error.message }),
        );
      }

      if (error instanceof Error) {
        throw new HealthCheckError(
          error.message,
          this.getStatus(key, false, { message: error.message }),
        );
      }
    }

    return this.getStatus(key, true);
  }

  private async pingTypesense(timeout: number): Promise<HealthResponse> {
    const check = client.health.retrieve();
    return await promiseTimeout(timeout, check);
  }
}
