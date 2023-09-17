import { HasuraService } from '../../global/graphql/hasura.service';
import { RequestContext } from '../../shards/abstract/request-context';
import { loadConfig } from '../../shards/utils/load-config';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { EntityManager } from '@mikro-orm/core';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileUpload } from '@okampus/api/dal';
import { BucketNames, EventContext, EntityName } from '@okampus/shared/enums';
import { checkImage, makeS3Url, randomId, streamToBuffer, toSlug } from '@okampus/shared/utils';

import QRCodeGenerator from 'qrcode';
import sharp from 'sharp';

import { Readable } from 'node:stream';

import type { HTTPResource } from '../../types/http-resource.type';
import type { User, Tenant } from '@okampus/api/dal';
import type { ApiConfig, MulterFile } from '@okampus/shared/types';

type UploadContext = {
  createdBy: User | null;
  entityName: EntityName;
  entityId: string | null;
  tenantScope: Tenant;
};

const ACL = 'public-read';
const nowString = () => new Date().toISOString().split('.')[0].replace('T', '-');

@Injectable()
export class UploadsService extends RequestContext {
  s3Config: ApiConfig['s3'];
  s3Client: S3Client;
  logger = new Logger(UploadsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
    private readonly hasuraService: HasuraService,
  ) {
    super();

    this.s3Config = loadConfig(this.configService, 's3');
    this.s3Client = new S3Client(this.s3Config);
  }

  public async upload(
    stream: Readable,
    size: number,
    type: string,
    key: string,
    bucket: BucketNames,
    context: UploadContext,
  ): Promise<HTTPResource> {
    const Bucket = this.s3Config.bucketNames[bucket];
    const ContentLength = size || stream.readableLength;

    const eventContext = context.createdBy?.id ?? EventContext.System;
    const Key = context.entityId
      ? `${context.tenantScope.id}/${context.entityName}/${context.entityId}/${eventContext}/${key}`
      : `${context.tenantScope.id}/${context.entityName}/${eventContext}/${key}`;

    this.logger.log(`Uploading ${key} to ${Bucket}..`);
    try {
      const command = new PutObjectCommand({ Bucket, Key, ACL, ContentLength, ContentType: type, Body: stream });
      const { ETag } = await this.s3Client.send(command, { requestTimeout: 300_000 });
      if (!ETag) throw new BadRequestException('Failed to upload file to S3');

      this.logger.debug(`Uploaded ${key} to ${Bucket} (${ContentLength} bytes, etag: ${ETag})!`);
      return {
        url: makeS3Url(Bucket, Key, this.s3Config),
        etag: ETag,
        size: ContentLength,
      };
    } catch (error) {
      this.logger.error(`Failed to upload ${key} to ${Bucket}: ${error}`);
      throw error;
    }
  }

  public async createUpload(file: MulterFile, bucket: BucketNames, context: UploadContext): Promise<FileUpload> {
    let stream: Readable;
    if (file.createReadStream) stream = file.createReadStream();
    else if (file.buffer) stream = Readable.from(file.buffer);
    else throw new BadRequestException('File missing a stream or a buffer');

    this.logger.log(`Creating ${context.entityName} upload.. ${stream.readableLength}`);

    const type = file.mimetype ?? 'application/octet-stream';
    const createdById = context.createdBy?.id ?? null;
    const slug = toSlug(file.filename ?? file.fieldname);
    const key = `${slug}-${nowString()}-${randomId()}.${type.split('/')[1]}`;

    const { url, size } = await this.upload(stream, file.size, type, key, bucket, context);
    const name = file.originalname ?? file.filename ?? key;
    const fileLastModifiedAt = file.fileLastModifiedAt?.toISOString() ?? new Date().toISOString();

    const tenantScopeId = context.tenantScope.id;
    const fileInsert = { fileLastModifiedAt, name, size, type, url, createdById, tenantScopeId };

    const data = await this.hasuraService.insertOne('insertFileUploadOne', ['id'], fileInsert);
    return await this.em.findOneOrFail(FileUpload, { id: data.insertFileUploadOne.id });
  }

  public async createImageUpload(
    file: MulterFile,
    bucket: BucketNames,
    context: UploadContext,
    height: number,
  ): Promise<FileUpload> {
    if (!checkImage(file)) throw new BadRequestException(`${context.entityName} file is not an image.`);

    let initial;
    if (file.buffer) initial = file.buffer;
    else if (file.createReadStream) initial = await streamToBuffer(file.createReadStream());
    else throw new BadRequestException(`${context.entityName} file is missing a buffer or a stream.`);

    const buffer = await sharp(initial).resize(null, height).webp({ quality: 80, effort: 3 }).toBuffer();
    this.logger.log(`Resized ${context.entityName} image to ${buffer.length} bytes.`);

    return this.createUpload(
      { ...file, buffer, createReadStream: () => Readable.from(buffer), mimetype: 'image/webp', size: buffer.length },
      bucket,
      context,
    );
  }

  public async uploadQR(
    data: string,
    fieldname: string,
    type: EntityName.EventJoin | EntityName.Team,
    entityId: string,
    createdBy: User | null,
    tenant: Tenant,
  ): Promise<FileUpload> {
    const qrCode = await QRCodeGenerator.toDataURL(data);
    const buffer = Buffer.from(qrCode.split(',')[1], 'base64');

    const file = { buffer, fieldname, mimetype: 'application/octet-stream', size: buffer.length };
    const context = { createdBy, tenantScope: tenant, entityName: type, entityId };
    return await this.createImageUpload(file, BucketNames.QR, context, 150);
  }

  public async uploadSignature(file: MulterFile, createdBy: User, tenant: Tenant) {
    if (createdBy.isBot) throw new BadRequestException('Requester is not a user');
    const context = { createdBy, tenantScope: tenant, entityName: EntityName.User, entityId: createdBy.id };
    return await this.createImageUpload(file, BucketNames.Signatures, context, 300);
  }
}
