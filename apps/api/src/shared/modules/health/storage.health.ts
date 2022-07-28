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
    const timeout = options?.timeout ?? 1000;

    try {
      await this.pingS3(timeout, bucket);
    } catch (error: unknown) {
      if (error instanceof PromiseTimeoutError) {
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

  private async pingS3(timeout: number, bucket: string): Promise<Record<string, never>> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const check = this.s3.headBucket({ Bucket: bucket }).promise();
    return await promiseTimeout(timeout, check);
  }
}
