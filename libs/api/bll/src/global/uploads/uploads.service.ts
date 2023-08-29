import { HasuraService } from '../../global/graphql/hasura.service';
import { RequestContext } from '../../shards/abstract/request-context';
import { loadConfig } from '../../shards/utils/load-config';

import { EntityManager } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { FileUpload } from '@okampus/api/dal';
import { Buckets, EventContext, EntityName } from '@okampus/shared/enums';
import { checkImage, randomId, streamToBuffer, toSlug } from '@okampus/shared/utils';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import QRCodeGenerator from 'qrcode';
import sharp from 'sharp';
import { Readable } from 'node:stream';
import { promises as fs } from 'node:fs';

import type { HTTPResource } from '../../types/http-resource.type';
import type { User, Tenant } from '@okampus/api/dal';
import type { ApiConfig, MulterFile } from '@okampus/shared/types';

type UploadContext = {
  createdBy: User | null;
  entityName: EntityName;
  entityId: string | null;
  tenant: Tenant;
};

const ACL = 'public-read';
const nowString = () => new Date().toISOString().split('.')[0].replace('T', '-');

// Writefile and create parent directories if they don't exist
const writeFile = async (path: string, data: Buffer) => {
  const dir = path.split('/').slice(0, -1).join('/');
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(error);
  }

  try {
    await fs.writeFile(path, data);
  } catch (error) {
    console.error(error);
  }
};

@Injectable()
export class UploadsService extends RequestContext {
  isEnabled: boolean;
  bucketNames: Record<Buckets, string>;

  s3Client: S3Client | null;
  logger = new Logger(UploadsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly hasuraService: HasuraService,
    private readonly em: EntityManager,
  ) {
    super();

    const { buckets, isEnabled, ...s3Config } = loadConfig<ApiConfig['s3']>(this.configService, 's3');

    this.isEnabled = isEnabled;
    this.bucketNames = buckets;

    this.s3Client = this.isEnabled ? new S3Client(s3Config) : null;
  }

  public async upload(
    stream: Readable,
    size: number,
    type: string,
    key: string,
    bucket: Buckets,
    context: UploadContext,
  ): Promise<HTTPResource> {
    const Bucket = this.bucketNames[bucket];
    const ContentLength = size || stream.readableLength;

    const eventContext = context.createdBy?.id ?? EventContext.System;
    const Key = context.entityId
      ? `${context.tenant.id}/${context.entityName}/${context.entityId}/${eventContext}/${key}`
      : `${context.tenant.id}/${context.entityName}/${eventContext}/${key}`;

    if (!this.isEnabled) {
      const buffer = await streamToBuffer(stream);
      const localPath = loadConfig<string>(this.configService, 'upload.localPath');
      await writeFile(`${localPath}/${Bucket}/${Key}`, buffer);

      const url = `${loadConfig<string>(this.configService, 'network.apiUrl')}/uploads/${Bucket}/${Key}`;
      return { url, etag: key, size: ContentLength };
    }

    if (!this.s3Client) throw new BadRequestException('S3 client is not initialized');

    this.logger.log(`Uploading ${key} to ${Bucket}..`);
    try {
      const command = new PutObjectCommand({ Bucket, Key, ACL, ContentLength, ContentType: type, Body: stream });
      const { ETag } = await this.s3Client.send(command, { requestTimeout: 300_000 });
      if (!ETag) throw new BadRequestException('Failed to upload file to S3');

      this.logger.debug(`Uploaded ${key} to ${Bucket} (${ContentLength} bytes, etag: ${ETag})!`);
      return { url: `https://bucket-${Bucket}.okampus.fr/${Key}`, etag: ETag, size: ContentLength };
    } catch (error) {
      this.logger.error(`Failed to upload ${key} to ${Bucket}: ${error}`);
      throw error;
    }
  }

  public async createUpload(file: MulterFile, bucket: Buckets, context: UploadContext): Promise<FileUpload> {
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

    const tenantId = context.tenant.id;
    const fileInsert = { fileLastModifiedAt, name, size, type, url, createdById, tenantId };

    const data = await this.hasuraService.insertOne('insertFileUploadOne', ['id'], fileInsert);
    return this.em.findOneOrFail(FileUpload, { id: data.insertFileUploadOne.id });
  }

  public async createImageUpload(
    file: MulterFile,
    bucket: Buckets,
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
    const context = { createdBy, tenant, entityName: type, entityId };
    return await this.createImageUpload(file, Buckets.QR, context, 150);
  }

  public async uploadSignature(file: MulterFile, createdBy: User, tenant: Tenant) {
    if (createdBy.isBot) throw new BadRequestException('Requester is not a user');
    const context = { createdBy, tenant, entityName: EntityName.User, entityId: createdBy.id };
    return await this.createImageUpload(file, Buckets.Signatures, context, 300);
  }
}
