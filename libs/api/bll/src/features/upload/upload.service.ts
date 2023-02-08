// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../global/config.module';
import { RequestContext } from '../../shards/abstract/request-context';

import { Client } from 'minio';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentUpload, FileUpload, ImageUpload, VideoUpload } from '@okampus/api/dal';
import { DocumentUploadType, FileUploadKind, ResourceType, S3Buckets } from '@okampus/shared/enums';
import { checkDocument, checkImage, checkVideo, snowflake, streamToBuffer } from '@okampus/shared/utils';

import { Readable } from 'node:stream';
import { promises } from 'node:fs';

import type { FileUploadOptions, TenantCore } from '@okampus/api/dal';
import type { ApiConfig, MulterFileType } from '@okampus/shared/types';
import type { HTTPResource } from '../../shards/types/http-resource.type';

@Injectable()
export class UploadService extends RequestContext {
  minioClient: Client | null;
  config: ApiConfig;

  constructor(private readonly configService: ConfigService) {
    super();
    this.minioClient = this.configService.config.s3.enabled
      ? new Client({
          endPoint: this.configService.config.s3.endpoint,
          accessKey: this.configService.config.s3.accessKeyId,
          secretKey: this.configService.config.s3.secretAccessKey,
          region: this.configService.config.s3.region,
        })
      : null;
    this.config = this.configService.config;
  }

  public async upload(stream: Readable, mime: string, key: string, bucket: S3Buckets): Promise<HTTPResource> {
    if (!this.config.s3.enabled) {
      const { writeFile } = promises;

      const buffer = await streamToBuffer(stream);
      const fullPath = `${this.config.upload.localPath}/${bucket}/${key}`;
      await writeFile(fullPath, buffer);

      return {
        url: new URL(fullPath, this.config.network.apiUrl).href,
        etag: key,
        size: buffer.length,
      };
    }

    if (!this.minioClient) throw new BadRequestException('Minio client is not initialized');

    const { etag } = await this.minioClient.putObject(bucket, key, stream, { 'Content-Type': mime });
    const { size } = await this.minioClient.statObject(bucket, key);

    return { url: `${bucket}/${key}`, etag, size };
  }

  public async createFileUpload(
    tenant: TenantCore,
    file: MulterFileType,
    resourceType: ResourceType
  ): Promise<FileUpload | null> {
    const fileCheckPayload = { type: file.mimetype ?? 'application/octet-stream' };
    if (checkImage(fileCheckPayload)) {
      switch (resourceType) {
        case ResourceType.Content: {
          return this.createImageUpload(tenant, file, S3Buckets.Attachments);
        }
        case ResourceType.User: {
          return this.createImageUpload(tenant, file, S3Buckets.UserImages);
        }
        case ResourceType.Org: {
          return this.createImageUpload(tenant, file, S3Buckets.OrgImages);
        }
        default: {
          return null;
        }
      }
    } else if (checkDocument(fileCheckPayload)) {
      switch (resourceType) {
        case ResourceType.Content: {
          return this.createDocumentUpload(tenant, file, S3Buckets.Attachments);
        }
        case ResourceType.Org: {
          return this.createDocumentUpload(tenant, file, S3Buckets.OrgDocuments);
        }
        default: {
          return null;
        }
      }
    } else if (checkVideo(fileCheckPayload)) {
      switch (resourceType) {
        case ResourceType.Content: {
          return this.createDocumentUpload(tenant, file, S3Buckets.Attachments);
        }
        case ResourceType.Org: {
          return this.createVideoUpload(tenant, file, S3Buckets.OrgVideos);
        }
        default: {
          return null;
        }
      }
    }

    if (resourceType === ResourceType.Content) {
      const fileOptions = await this.uploadFile(tenant, file, S3Buckets.Attachments);
      return new FileUpload({ ...fileOptions, fileUploadKind: FileUploadKind.FileUpload });
    }

    return null;
  }

  public async createImageUpload(tenant: TenantCore, file: MulterFileType, bucket: S3Buckets): Promise<ImageUpload> {
    // TODO: safe validation
    const payload = await this.uploadFile(tenant, file, bucket);

    // TODO: Run in a separate event

    // let meta = {};
    // if (file.mimetype.startsWith('image/')) {
    //   const image = sharp(buffer);
    //   buffer = await image.resize(null, 600).webp({ effort: 3 }).toBuffer();
    //   mimeType = 'image/webp';
    //   const metadata = await image.metadata();
    //   meta = { width: metadata.width, height: metadata.height };
    // }

    return new ImageUpload(payload);
  }

  public async createDocumentUpload(
    tenant: TenantCore,
    file: MulterFileType,
    bucket: S3Buckets
  ): Promise<DocumentUpload> {
    const payload = await this.uploadFile(tenant, file, bucket);

    // TODO: manage types later & extra events
    return new DocumentUpload({ ...payload, documentType: DocumentUploadType.Document });
  }

  public async createVideoUpload(tenant: TenantCore, file: MulterFileType, bucket: S3Buckets): Promise<VideoUpload> {
    const payload = await this.uploadFile(tenant, file, bucket);
    return new VideoUpload(payload);
  }

  public async uploadFile(tenant: TenantCore, file: MulterFileType, bucket: S3Buckets): Promise<FileUploadOptions> {
    const id = snowflake();
    const mime = file.mimetype ?? 'application/octet-stream';

    let stream: Readable;
    if (file.createReadStream) stream = file.createReadStream();
    else if (file.buffer) stream = Readable.from(file.buffer);
    else throw new BadRequestException('File is not a stream or buffer');

    const resource = await this.upload(stream, mime, id, bucket);
    return {
      id,
      tenant,
      uploadedBy: this.requester(),
      name: file.originalname ?? file.filename ?? id,
      size: resource.size ?? file.size ?? 0,
      mime,
      lastModifiedAt: file.fileLastModifiedAt,
      url: resource.url,
    };

    // if (fileUploadKind === FileUploadKind.VideoUpload) {
    //   return new VideoUpload({ uploadedBy, tenant, name, size, mime, lastModifiedAt, url });
    // const fileDocument = new FileUpload({ uploadedBy, tenant, name, size, mime, fileUploadKind, lastModifiedAt, url });

    // await this.fileUploadRepository.persistAndFlush(fileDocument);

    // return fileDocument;
  }
}
