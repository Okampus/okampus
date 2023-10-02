import { getOcrPresignedUrlDto } from '../dtos/getOcrPresignedUrl';
import { protectedProcedure } from '../trpc';
import { s3Client, s3OcrClient } from '../../../config/secrets';
import { ocrBucketNames } from '../../../config';

import { S3Providers } from '@okampus/shared/enums';
import { randomId } from '@okampus/shared/utils';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const getOcrPresignedUrl = protectedProcedure
  .input(getOcrPresignedUrlDto)
  .query(async ({ input: { bucket } }) => {
    const key = `${Date.now()}-${randomId()}`;
    const command = new PutObjectCommand({ Bucket: ocrBucketNames[bucket], Key: key });
    const url = s3OcrClient ? await getSignedUrl(s3OcrClient, command) : await getSignedUrl(s3Client, command);

    return { provider: S3Providers.OCR, key, url, bucket };
  });
