import { bucketNames } from '../../../config';
import { s3Config } from '../../../config/secrets';
import { protectedProcedure } from '../trpc';
import { getPresignedUrlsDto } from '../dtos/getPresignedUrls';
import { getS3Key } from '../../../utils/s3/get-s3-key';

import { getDateTimeString, uniqueSlug } from '@okampus/shared/utils';
import { S3Providers } from '@okampus/shared/enums';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client(s3Config);

export const getPresignedUrls = protectedProcedure
  .input(getPresignedUrlsDto)
  .query(async ({ input: { count, bucket, entityName, tenantScopeId, createdById } }) => {
    const urls = [];
    for (let i = 0; i < count; i++) {
      const key = getS3Key(uniqueSlug(getDateTimeString(new Date())), entityName, tenantScopeId, createdById);
      const url = await getSignedUrl(s3Client, new PutObjectCommand({ Bucket: bucketNames[bucket], Key: key }));
      urls.push({ provider: S3Providers.S3, url, key, bucket });
    }

    return urls;
  });
