import { prisma } from '../db';
import { s3Client } from '../../../config/secrets';
import { bucketNames } from '../../../config';
import { getS3Key } from '../../../utils/s3/get-s3-key';
import { getS3Url } from '../../../utils/s3/get-s3-url';

import { S3Providers, S3BucketNames } from '@okampus/shared/enums';
import { toSlug, randomId, checkImage, streamToBuffer } from '@okampus/shared/utils';

import { PutObjectCommand } from '@aws-sdk/client-s3';

import QRCodeGenerator from 'qrcode';
import sharp from 'sharp';
import { Readable } from 'node:stream';

import type { MulterFile } from '@okampus/shared/types';
import type { EntityNames } from '@okampus/shared/enums';

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

type Metadata = { mimetype?: string; filename?: string };
export async function createUpload(
  buffer: Buffer,
  meta: Metadata,
  bucket: S3BucketNames,
  entityName: EntityNames,
  scope: ScopedOptions,
) {
  const stream = Readable.from(buffer);
  const type = meta.mimetype ?? 'application/octet-stream';

  const key = `${toSlug(meta.filename ?? 'upload')}-${Date.now()}-${randomId()}}.${type.split('/')[1]}`;
  const uploaded = await upload(stream, type, key, bucket, entityName, scope);

  return await prisma.fileUpload.create({
    data: {
      name: meta.filename ?? 'upload',
      url: uploaded.url,
      size: uploaded.size,
      type: type,
      bucket: bucket,
    },
  });
}

export async function createImageUpload(
  file: MulterFile,
  bucket: S3BucketNames,
  entityName: EntityNames,
  height: number,
  scope: ScopedOptions,
) {
  if (!checkImage(file)) throw new Error('File is not an image.');

  let initial;
  if (file.buffer) initial = file.buffer;
  else if (file.createReadStream) initial = await streamToBuffer(file.createReadStream());

  const buffer = await sharp(initial).resize(null, height).webp({ quality: 80, effort: 3 }).toBuffer();
  return await createUpload(buffer, { filename: file.originalname, mimetype: 'image/webp' }, bucket, entityName, scope);
}

export async function uploadQR(
  data: string,
  fieldname: string,
  entityName: EntityNames.EventJoin | EntityNames.Team,
  scope: ScopedOptions,
) {
  const qrCode = await QRCodeGenerator.toDataURL(data);
  const buffer = Buffer.from(qrCode.split(',')[1], 'base64');

  const file = { buffer, fieldname, mimetype: 'application/octet-stream', size: buffer.length };
  return await createImageUpload(file, S3BucketNames.QR, entityName, 150, scope);
}

export async function uploadSignature(file: MulterFile, entityName: EntityNames, scope: ScopedOptions) {
  return await createImageUpload(file, S3BucketNames.Signatures, entityName, 300, scope);
}
