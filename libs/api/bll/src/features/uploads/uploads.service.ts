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
import type { Individual, Tenant } from '@okampus/api/dal';
import type { ApiConfig, MulterFile } from '@okampus/shared/types';

type ActorEntity = EntityName.Team | EntityName.User | EntityName.Bot;
type UploadContext = {
  createdBy: Individual | null;
  entityName: EntityName;
  entityId: string;
  tenant: Tenant;
};

const ACL = 'public-read';
const nowString = () => new Date().toISOString().split('.')[0].replace('T', '-');

@Injectable()
export class UploadsService extends RequestContext {
  isEnabled: boolean;
  bucketNames: Record<Buckets, string>;

  s3Client: S3Client | null;
  logger = new Logger(UploadsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly hasuraService: HasuraService,
    private readonly em: EntityManager
  ) {
    super();

    const { buckets, isEnabled, ...s3Config } = loadConfig<ApiConfig['s3']>(this.configService, 's3');

    this.isEnabled = isEnabled;
    this.bucketNames = buckets;

    this.s3Client = this.isEnabled ? new S3Client(s3Config) : null;
  }

  public async upload(
    stream: Readable,
    type: string,
    key: string,
    bucket: Buckets,
    context: UploadContext
  ): Promise<HTTPResource> {
    const Bucket = this.bucketNames[bucket];
    const ContentLength = stream.readableLength;
    const Key = `${context.tenant.id}/${context.entityName}/${context.entityId}/${key}`;

    if (!this.isEnabled) {
      const buffer = await streamToBuffer(stream);
      const localPath = loadConfig<string>(this.configService, 'upload.localPath');
      await fs.writeFile(`${localPath}/${Key}`, buffer);

      const url = `${loadConfig<string>(this.configService, 'network.apiUrl')}/uploads/${Bucket}/${Key}`;
      return { url, etag: key, size: ContentLength };
    }

    if (!this.s3Client) throw new BadRequestException('S3 client is not initialized');

    this.logger.debug(`Uploading ${key} to ${Bucket}..`);
    try {
      const command = new PutObjectCommand({ Bucket, Key, ACL, ContentLength, ContentType: type, Body: stream });

      const { ETag } = await this.s3Client.send(command);
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

    const type = file.type ?? 'application/octet-stream';
    const createdById = context.createdBy?.id;
    const slug = toSlug(file.filename ?? file.fieldname);
    const key = `${slug}-${createdById ?? EventContext.System}-${nowString()}-${randomId()}`;

    const { url, size } = await this.upload(stream, type, key, bucket, context);
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
    height: number
  ): Promise<FileUpload> {
    if (!checkImage(file)) throw new BadRequestException(`${context.entityName} file is not an image.`);
    if (!file.buffer) throw new BadRequestException(`${context.entityName} file is missing a buffer.`);

    const buffer = await sharp(file.buffer).resize(null, height).webp({ quality: 80, effort: 3 }).toBuffer();

    return this.createUpload({ ...file, buffer, type: 'image/webp', size: buffer.length }, bucket, context);
  }

  public async uploadActorDocument(
    file: MulterFile,
    type: ActorEntity,
    actorId: string,
    createdBy: Individual | null,
    tenant: Tenant
  ) {
    const context = { createdBy, tenant, entityName: type, entityId: actorId };
    return await this.createUpload(file, Buckets.ActorDocuments, context);
  }

  public async uploadActorImage(
    file: MulterFile,
    type: ActorEntity,
    actorId: string,
    createdBy: Individual | null,
    tenant: Tenant
  ) {
    const context = { createdBy, tenant, entityName: type, entityId: actorId };
    return await this.createImageUpload(file, Buckets.ActorImages, context, 400);
  }

  public async uploadActorVideo(
    file: MulterFile,
    type: ActorEntity,
    actorId: string,
    createdBy: Individual | null,
    tenant: Tenant
  ) {
    const context = { createdBy, tenant, entityName: type, entityId: actorId };
    return await this.createUpload(file, Buckets.ActorVideos, context);
  }

  public async uploadAttachment(
    file: MulterFile,
    type: EntityName.Content | EntityName.GrantUnlock,
    entityId: string,
    createdBy: Individual | null,
    tenant: Tenant
  ) {
    const context = { createdBy, tenant, entityName: type, entityId };
    return await this.createUpload(file, Buckets.ActorVideos, context);
  }

  public async uploadQR(
    data: string,
    fieldname: string,
    type: EntityName.EventJoin | EntityName.Team,
    entityId: string,
    createdBy: Individual | null,
    tenant: Tenant
  ): Promise<FileUpload> {
    const qrCode = await QRCodeGenerator.toDataURL(data);
    const buffer = Buffer.from(qrCode.split(',')[1], 'base64');

    const file = { buffer, fieldname, type: 'application/octet-stream', size: buffer.length };
    const context = { createdBy, tenant, entityName: type, entityId };
    return await this.createImageUpload(file, Buckets.QR, context, 150);
  }

  public async uploadSignature(file: MulterFile, createdBy: Individual, tenant: Tenant) {
    if (!createdBy?.user) throw new BadRequestException('Requester is not a user');
    const context = { createdBy, tenant, entityName: EntityName.User, entityId: createdBy.user.id };
    return await this.createImageUpload(file, Buckets.Signatures, context, 300);
  }

  public async uploadReceipt(
    file: MulterFile,
    type: EntityName.Grant | EntityName.Expense | EntityName.ExpenseItem | EntityName.Finance,
    entityId: string,
    createdBy: Individual | null,
    tenant: Tenant
  ) {
    const context = { createdBy, tenant, entityName: type, entityId };
    return await this.createUpload(file, Buckets.ActorVideos, context);
  }

  public async uploadThumbnail(
    file: MulterFile,
    type: EntityName.Tag | EntityName.Location,
    entityId: string,
    createdBy: Individual | null,
    tenant: Tenant
  ) {
    const context = { createdBy, tenant, entityName: type, entityId };
    return await this.createImageUpload(file, Buckets.Thumbnails, context, 200);
  }
}
