import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator, TimeoutError } from '@nestjs/terminus';
import { promiseTimeout, TimeoutError as PromiseTimeoutError } from '@nestjs/terminus/dist/utils';
import { meiliSearchClient } from '../../configs/meilisearch.config';

interface MeiliSearchHealthIndicatorOptions {
  timeout?: number;
}

@Injectable()
export class MeiliSearchHealthIndicator extends HealthIndicator {
  public async pingCheck(key: string, options?: MeiliSearchHealthIndicatorOptions): Promise<HealthIndicatorResult> {
    const timeout = options?.timeout ?? 1000;

    try {
      await this.pingMeilisearch(timeout);
    } catch (error) {
      console.log('ERROR', error);
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

  private async pingMeilisearch(timeout: number): Promise<boolean> {
    return await promiseTimeout(timeout, meiliSearchClient.isHealthy());
  }
}
