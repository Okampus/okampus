import { s3Client } from '../../../config/secrets';
import { baseUrl, bucketNames, protocol } from '../../../config';
import { getS3Key } from '../../../utils/s3/get-s3-key';
import { getS3Url } from '../../../utils/s3/get-s3-url';

import { InternalServerError, ServerError, ServiceUnavailableError } from '../../../server/error';
import { prisma } from '../db';
import { EntityNames, S3Providers, S3BucketNames } from '@okampus/shared/enums';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';

import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ActorImageType } from '@prisma/client';

import QRCodeGenerator from 'qrcode';
import sharp from 'sharp';

import type { AuthContextMaybeUser } from '../../../server/actions/utils/withAuth';
import type { FileUpload } from '@prisma/client';

const ACL = 'public-read';

// TODO: TEMP uploads are broken

export type UploadCallbackOptions = { url: string; size: number; type: string };
export type UploadOptions = {
  blob: Blob;
  bucketName: S3BucketNames;
  key: string;
  authContext: AuthContextMaybeUser;
  processFile?: (buffer: Buffer, file: Blob) => Promise<{ buffer: Buffer; type: string }>;
};
export async function upload(upload: UploadOptions, callback: (uploaded: FileUpload) => Promise<void>) {
  const { bucketName, key } = upload;

  const arrayBuffer = await upload.blob.arrayBuffer();

  try {
    const { buffer, type } = upload.processFile
      ? await upload.processFile(Buffer.from(arrayBuffer), upload.blob)
      : { buffer: Buffer.from(arrayBuffer), type: upload.blob.type };

    const bucket = bucketNames[bucketName];

    const size = Buffer.byteLength(arrayBuffer);
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ACL, ContentLength: size, Body: buffer });

    const { ETag } = await s3Client.send(command, { requestTimeout: 300 });
    if (!ETag) throw new ServiceUnavailableError('S3_ERROR');

    const url = getS3Url({ provider: S3Providers.S3, bucket: bucketName, key });
    if (!url) throw new ServiceUnavailableError('S3_ERROR');

    try {
      const fileUpload = await prisma.fileUpload.create({ data: { name: '', url, size, type } });
      await callback(fileUpload);
    } catch (error) {
      const deleteCommand = new DeleteObjectCommand({ Bucket: bucket, Key: key });
      await s3Client.send(deleteCommand);
      await prisma.fileUpload.delete({ where: { url } });

      if (error instanceof ServerError) throw error;
      throw new InternalServerError('UNKNOWN_ERROR');
    }
  } catch {
    return; // Processing or upload failed
  }
}

const actorImageDimensions = {
  [ActorImageType.Avatar]: { width: 300, height: 300 },
  [ActorImageType.Banner]: { width: BANNER_ASPECT_RATIO * 450, height: 450 },
  [ActorImageType.Gallery]: { width: 450, height: 450 },
};

async function processImageFile(buffer: Buffer, type?: ActorImageType) {
  buffer = type ? await sharp(buffer).resize(actorImageDimensions[type]).webp().toBuffer() : buffer;
  return { buffer, type: 'image/webp' };
}

export type CreateActorImageOptions = {
  blob: Blob;
  actorImageType: ActorImageType;
  actorId: bigint;
  authContext: AuthContextMaybeUser;
};
export async function createActorImage({ blob, actorImageType, actorId, authContext }: CreateActorImageOptions) {
  const { tenant, userId } = authContext;
  const key = getS3Key(`${actorId}-${actorImageType}`, EntityNames.ActorImage, tenant.id, userId);
  const bucket = S3BucketNames.ActorImages;

  let fileUpload: FileUpload | undefined;

  const processFile = (buffer: Buffer) => processImageFile(buffer, actorImageType);

  await upload({ bucketName: bucket, blob: blob, key, authContext, processFile }, async ({ url, size, type }) => {
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.actorImage.updateMany({ where: { actorId, type: actorImageType }, data: { deletedAt: now } });
      fileUpload = await tx.fileUpload.create({ data: { name: blob.name, url, size, type } });
      await tx.actorImage.create({ data: { type: actorImageType, actorId, imageId: fileUpload.id } });

      if (actorImageType === ActorImageType.Avatar) {
        await tx.actor.update({ where: { id: actorId }, data: { avatar: url } });
      } else if (actorImageType === ActorImageType.Banner) {
        await tx.actor.update({ where: { id: actorId }, data: { banner: url } });
      }
    });
  });

  return fileUpload;
}

export async function createEventJoinQR(eventJoinId: bigint, authContext: AuthContextMaybeUser) {
  const confirmAttendanceUrl = `${protocol}://${authContext.tenant.domain}.${baseUrl}/confirm-attendance/${eventJoinId}`;
  const qrCode = await QRCodeGenerator.toDataURL(confirmAttendanceUrl, { type: 'image/webp', scale: 6 });
  // const file = new File([Buffer.from(qrCode.split(',')[1], 'base64')], 'qr.webp', { type: 'image/webp' });
  const blob = new Blob([Buffer.from(qrCode.split(',')[1], 'base64')], { type: 'image/webp' });
  const key = getS3Key('qr', EntityNames.EventJoin, authContext.tenant.id, authContext.userId);
  const bucket = S3BucketNames.QR;

  let fileUpload: FileUpload | undefined;
  await upload({ bucketName: bucket, blob: blob, key, authContext }, async ({ url, size, type }) => {
    await prisma.$transaction(async (tx) => {
      fileUpload = await tx.fileUpload.create({ data: { name: 'qr.webp', url, size, type } });
      await tx.eventJoin.update({ where: { id: eventJoinId }, data: { qrCodeId: fileUpload.id } });
    });
  });

  return fileUpload;
}
