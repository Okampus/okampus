import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator, TimeoutError } from '@nestjs/terminus';
import { promiseTimeout, TimeoutError as PromiseTimeoutError } from '@nestjs/terminus/dist/utils';
import type { AWSError } from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';

interface S3HealthIndicatorOptions {
  timeout?: number;
}

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(
    @InjectS3() private readonly s3: S3,
  ) { super(); }

  public async pingCheck(
    key: string,
    bucket: string,
    options?: S3HealthIndicatorOptions,
  ): Promise<HealthIndicatorResult> {
    const timeout = options?.timeout ?? 2000;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const request = this.s3.headBucket({ Bucket: bucket });

    try {
      await this.pingS3(timeout, request);
    } catch (error: unknown) {
      if (error instanceof PromiseTimeoutError) {
        request.abort();
        throw new TimeoutError(
          timeout,
          this.getStatus(key, false, { message: error.message }),
        );
      }

      const awsError = error as AWSError;
      const message = `${awsError.code}${awsError.message ? `: ${awsError.message}` : ''}`;
      throw new HealthCheckError(
        message,
        this.getStatus(`${key}-${bucket}`, false, { message }),
      );
    }

    return this.getStatus(`${key}-${bucket}`, true);
  }

  private async pingS3(timeout: number, request: ReturnType<typeof this.s3.headBucket>): Promise<unknown> {
    return await promiseTimeout(timeout, request.promise());
  }
}
