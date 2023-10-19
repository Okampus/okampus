import { prisma } from '../db';
import { s3Client } from '../../../config/secrets';
import { bucketNames } from '../../../config';
import { getS3Key } from '../../../utils/s3/get-s3-key';
import { getS3Url } from '../../../utils/s3/get-s3-url';

import { S3Providers, S3BucketNames } from '@okampus/shared/enums';
import { checkImage, uniqueSlug, getDateTimeString } from '@okampus/shared/utils';

import { PutObjectCommand } from '@aws-sdk/client-s3';

import QRCodeGenerator from 'qrcode';
import sharp from 'sharp';
import { Readable } from 'node:stream';

import type { EntityNames } from '@okampus/shared/enums';
import type { FileMetadata } from '@okampus/shared/types';

const ACL = 'public-read';

type ScopedOptions = { tenantScopeId?: bigint | string | null; createdById?: bigint | string | null };

export async function upload(
  stream: Readable,
  type: string,
  key: string,
  bucket: S3BucketNames,
  entityName: EntityNames,
  scope: ScopedOptions,
): Promise<{ url: string; etag: string; size: number }> {
  const Bucket = bucketNames[bucket];
  const ContentLength = stream.readableLength;
  const Key = getS3Key(key, entityName, scope.tenantScopeId, scope.createdById);

  const command = new PutObjectCommand({ Bucket, Key, ACL, ContentLength, ContentType: type, Body: stream });
  const { ETag } = await s3Client.send(command, { requestTimeout: 300_000 });
  if (!ETag) throw new Error('Failed to upload file to S3.');

  const url = getS3Url({ provider: S3Providers.S3, bucket, key: Key });
  if (!url) throw new Error('Failed to generate S3 URL.');

  return { url, etag: ETag, size: ContentLength };
}

export async function createUpload(
  buffer: Buffer,
  meta: FileMetadata,
  bucket: S3BucketNames,
  entityName: EntityNames,
  scope: ScopedOptions,
) {
  const stream = Readable.from(buffer);
  const type = meta.mimetype ?? 'application/octet-stream';

  const name = meta.filename ?? 'file';
  const slug = uniqueSlug(`${name}-${getDateTimeString(new Date())}`);
  const key = `${slug}.${type.split('/')[1]}`;
  const { url, size } = await upload(stream, type, key, bucket, entityName, scope);

  return await prisma.fileUpload.create({ data: { name, url, size, type: type, bucket: bucket } });
}

export async function createImageUpload(
  buffer: Buffer,
  meta: FileMetadata,
  bucket: S3BucketNames,
  entityName: EntityNames,
  height: number,
  scope: ScopedOptions,
) {
  if (!checkImage(meta)) throw new Error('File is not an image.');

  const sharpBuffer = await sharp(buffer).resize(null, height).webp({ quality: 80, effort: 3 }).toBuffer();
  const filename = meta.filename ?? 'image';
  return await createUpload(sharpBuffer, { filename, mimetype: 'image/webp' }, bucket, entityName, scope);
}

export async function uploadQR(
  data: string,
  entityName: EntityNames.EventJoin | EntityNames.Team,
  scope: ScopedOptions,
) {
  const qrCode = await QRCodeGenerator.toDataURL(data, { type: 'image/webp' });
  const buffer = Buffer.from(qrCode.split(',')[1], 'base64');
  const meta = { filename: `qr.webp`, mimetype: 'image/webp' };
  return await createImageUpload(buffer, meta, S3BucketNames.QR, entityName, 150, scope);
}
