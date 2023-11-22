import { GetObjectCommand } from '@aws-sdk/client-s3';
import debug from 'debug';
import type { S3Client } from '@aws-sdk/client-s3';

const debugLog = debug('okampus:s3:read-s3-file');

export async function readS3File(s3Client: S3Client | null, bucket: string, key: string) {
  if (!s3Client) return null;
  const request = new GetObjectCommand({ Bucket: bucket, Key: key });
  try {
    const { Body } = await s3Client.send(request);
    const byteArray = await Body?.transformToByteArray();
    if (!byteArray) return null;

    return Buffer.from(byteArray);
  } catch (error) {
    debugLog({ error, bucket, key });
    return null;
  }
}
