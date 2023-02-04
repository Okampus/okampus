import type { S3 } from 'aws-sdk';
import stream from 'node:stream';

export function streamableS3(s3: S3, Bucket: string, Key: string, ContentType: string, ACL: string) {
  const pass = new stream.PassThrough();

  const params: S3.PutObjectRequest = { Key, Bucket, Body: pass, ACL, ContentType };
  return {
    writeStream: pass,
    uploadPromise: s3.upload(params).promise(),
  };
}
