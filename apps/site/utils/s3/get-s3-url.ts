import { urlJoin } from '../url-join';
import {
  bucketNames,
  isOcrEnabled,
  ocrBucketNames,
  protocol,
  s3Endpoint,
  s3ForcePathStyle,
  s3OcrEndpoint,
  s3OcrForcePathStyle,
} from '../../config';

import { S3Providers, S3BucketNames, OCRBucketNames } from '@okampus/shared/enums';
import { isIn } from '@okampus/shared/utils';

import type { PresignedUrl } from '@okampus/shared/types';

function pathStyleS3(endpoint: string, bucket: string, key: string, forcePathStyle: boolean) {
  if (forcePathStyle) urlJoin(`${protocol}://${endpoint}`, bucket, key);
  return urlJoin(`${protocol}://${bucket}.${endpoint}`, key);
}

export function getS3Url({ provider, bucket, key }: Omit<PresignedUrl, 'url'>) {
  if (!provider || !key) return null;
  if (provider === S3Providers.S3) {
    if (!bucket || !isIn(bucket, S3BucketNames) || !s3Endpoint) return null;
    return pathStyleS3(s3Endpoint, bucketNames[bucket], key, s3ForcePathStyle);
  }

  if (!isOcrEnabled) return null;
  if (provider === process.env.OCR_S3_PROVIDER) {
    if (!bucket || !isIn(bucket, OCRBucketNames) || !s3OcrEndpoint) return null;
    return pathStyleS3(s3OcrEndpoint, ocrBucketNames[bucket], key, s3OcrForcePathStyle);
  }

  return null;
}
