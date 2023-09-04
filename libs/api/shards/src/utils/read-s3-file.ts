import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { S3Client } from '@aws-sdk/client-s3';

export async function readS3File(s3Client: S3Client, bucket: string, key: string) {
  const request = new GetObjectCommand({ Bucket: bucket, Key: key });
  const { Body } = await s3Client.send(request);
  const byteArray = await Body?.transformToByteArray();
  if (!byteArray) return null;

  return Buffer.from(byteArray);
}
