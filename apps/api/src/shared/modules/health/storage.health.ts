import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthIndicator } from '@nestjs/terminus';
import type { AWSError } from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';
import type { UploadBucket } from '../../lib/types/enums/upload-bucket.enum';

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(
    @InjectS3() private readonly s3: S3,
  ) { super(); }

  public async pingCheck(key: string, bucket: UploadBucket): Promise<HealthIndicatorResult> {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await this.s3.headBucket({ Bucket: bucket }).promise();
      return this.getStatus(`${key}-${bucket}`, true);
    } catch (error: unknown) {
      const awsError = error as AWSError;
      return this.getStatus(`${key}-${bucket}`, false, {
        message: `${awsError.code}${awsError.message ? `: ${awsError.message}` : ''}`,
      });
    }
  }
}
