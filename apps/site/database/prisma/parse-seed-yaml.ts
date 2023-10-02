import { seedingBucket } from '../../config/secrets';
import { readS3File } from '../../server/utils/read-s3-file';

import { parseYaml } from '@okampus/shared/utils';
import type { S3Client } from '@aws-sdk/client-s3';

export async function parseSeedYaml<T>(s3Client: S3Client | null, key: string, faker: () => T): Promise<T> {
  if (!s3Client || !seedingBucket) return faker();
  const file = await readS3File(s3Client, seedingBucket, key);
  if (!file) return faker();
  const data = await parseYaml<T>(file.toString());
  if (!data) return faker();
  return data;
}
