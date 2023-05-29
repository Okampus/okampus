// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { RequestContext } from '../../shards/abstract/request-context';
import { loadConfig } from '../../shards/utils/load-config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { FileUpload } from '@okampus/api/dal';
import { Buckets } from '@okampus/shared/enums';
import { streamToBuffer, toSlug } from '@okampus/shared/utils';

import { Client } from 'minio';
import QRCodeGenerator from 'qrcode';
import sharp from 'sharp';

import { nanoid } from 'nanoid';
import { Readable } from 'node:stream';
import { promises } from 'node:fs';

import type { HTTPResource } from '../../types/http-resource.type';
import type { Individual, Tenant } from '@okampus/api/dal';
import type { ApiConfig, MulterFile } from '@okampus/shared/types';
import type { FastifyRequest } from 'fastify';

type ScopedOptions = { createdBy?: Individual | null; tenant?: Tenant; req?: FastifyRequest };

const nowString = () => new Date().toISOString().split('.')[0].replace('T', '.');

@Injectable()
export class UploadsService extends RequestContext {
  isEnabled: boolean;
  bucketNames: Record<Buckets, string>;

  minioClient: Client | null;

  uploadLocalPath: string;
  uploadLocalApiUrl: (bucket: string, key: string) => string;

  logger = new Logger(UploadsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly hasuraService: HasuraService,
    private readonly em: EntityManager
  ) {
    super();
    const s3config = loadConfig<ApiConfig['s3']>(this.configService, 's3');

    this.isEnabled = s3config.isEnabled;
    this.bucketNames = s3config.buckets;
    this.minioClient = this.isEnabled ? new Client(s3config) : null;

    this.uploadLocalPath = loadConfig<string>(this.configService, 'upload.localPath');
    this.uploadLocalApiUrl = (bucket: string, key: string) =>
      `${loadConfig<string>(this.configService, 'network.apiUrl')}/uploads/${bucket}/${key}`;
  }

  public async upload(stream: Readable, mime: string, key: string, bucket: Buckets): Promise<HTTPResource> {
    if (!this.isEnabled) {
      const buffer = await streamToBuffer(stream);
      await promises.writeFile(`${this.uploadLocalPath}/${bucket}/${key}`, buffer);

      return { url: this.uploadLocalApiUrl(bucket, key), etag: key, size: buffer.length };
    }

    if (!this.minioClient) throw new BadRequestException('Minio client is not initialized');
    const bucketName = this.bucketNames[bucket];

    const putOptions = { 'Content-Type': mime, 'X-AMZ-ACL': 'public-read' };

    this.logger.log(`Uploading ${key} to ${bucketName}..`);
    try {
      await this.minioClient.putObject(bucketName, key, stream, stream.readableLength, putOptions);
      const { size, etag } = await this.minioClient.statObject(bucketName, key);
      this.logger.log(`Uploaded ${key} to ${bucketName} (${size} bytes, etag: ${etag})!`);

      return { url: `https://${bucketName}/${key}`, etag, size };
    } catch (error) {
      this.logger.error(`Failed to upload ${key} to ${bucketName}: ${error}`);
      throw error;
    }
  }

  public async createUpload(file: MulterFile, bucket: Buckets, scopedOptions?: ScopedOptions): Promise<FileUpload> {
    const createdBy = scopedOptions?.createdBy === undefined ? this.requester() : scopedOptions.createdBy;
    const tenant = scopedOptions?.tenant ?? this.tenant();

    let stream: Readable;
    if (file.createReadStream) stream = file.createReadStream();
    else if (file.buffer) stream = Readable.from(file.buffer);
    else throw new BadRequestException('File is not a stream or buffer');

    // TODO: support different file types differently and ensure coherence with expected types
    // if (checkImage(mime)) {
    //   // let meta = {};
    //   // if (file.mimetype.startsWith('image/')) {
    //   //   const image = sharp(buffer);
    //   //   buffer = await image.resize(null, 600).webp({ effort: 3 }).toBuffer();
    //   //   mimeType = 'image/webp';
    //   //   const metadata = await image.metadata();
    //   //   meta = { width: metadata.width, height: metadata.height };
    //   // }
    // }

    const mime = file.mimetype ?? 'application/octet-stream';
    const key = `${nanoid(16)}.${toSlug(file.filename ?? file.fieldname)}.${toSlug(bucket)}.${nowString()}`;
    const { url, size } = await this.upload(stream, mime, key, bucket);
    const name = file.originalname ?? file.filename ?? key;
    const fileLastModifiedAt = file.fileLastModifiedAt?.toISOString() ?? new Date().toISOString();

    const fileInsert = {
      mime,
      name,
      size,
      fileLastModifiedAt,
      url,
      createdById: createdBy?.id ?? null,
      tenantId: tenant.id,
    };
    const data = await this.hasuraService.insert('insertFileUpload', ['id'], [fileInsert], undefined, true);
    const id = data.insertFileUpload.returning[0].id;

    return this.em.findOneOrFail(FileUpload, { id });
  }

  public async createQRUpload(data: string, name: string, scopedOptions?: ScopedOptions): Promise<FileUpload> {
    const qrCode = await QRCodeGenerator.toDataURL(data);
    const qrBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
    const buffer = await sharp(qrBuffer).webp({ quality: 80, effort: 3 }).toBuffer();

    const file = { buffer, mimetype: 'image/webp', size: buffer.length, fileLastModifiedAt: new Date() };
    return this.createUpload({ ...file, filename: name, fieldname: 'qr' }, Buckets.QR, scopedOptions);
  }
}
