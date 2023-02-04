import { RequestContext } from '../../shards/request-context/request-context';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentUpload, FileUpload, ImageUpload, VideoUpload } from '@okampus/api/dal';
import { InjectS3 } from 'nestjs-s3';
import { DocumentUploadType, FileUploadKind, ResourceType, S3Buckets } from '@okampus/shared/enums';
import { checkDocument, checkImage, checkVideo, snowflake, streamableS3, streamToBuffer } from '@okampus/shared/utils';
import { Readable } from 'node:stream';
// import type { FileKind } from '@lib/types/enums/file-kind.enum';
// import { streamToBuffer } from '@lib/utils/stream-to-buffer';
// import type { Tenant } from '@tenants/tenant.entity';
// import type { User } from '@uaa/users/user.entity';
// import { FileUpload } from './file-upload.entity';
import { promises } from 'node:fs';

import path from 'node:path';
import type { FileUploadOptions, TenantCore} from '@okampus/api/dal';
import type { S3 } from 'aws-sdk';
import type { ApiConfig, MulterFileType } from '@okampus/shared/types';
import type { HTTPResource } from '../../shards/types/http-resource.type';
import type { ConfigService } from '../../global/config.module';

@Injectable()
export class UploadService extends RequestContext {
  config: ApiConfig;

  constructor(@InjectS3() private readonly s3: S3, private readonly configService: ConfigService) {
    super();
    this.config = this.configService.config;
  }

  public async upload(stream: Readable, mime: string, key: string, bucket: S3Buckets): Promise<HTTPResource> {
    if (!this.config.s3.enabled) {
      const { writeFile } = promises;

      const buffer = await streamToBuffer(stream);
      const fullPath = path.join(__dirname, '..', '..', '..', 'apps/api', this.config.upload.path, bucket, key);
      await writeFile(fullPath, buffer);

      return {
        url: new URL(path.join(this.config.upload.path, bucket, key), this.config.network.apiUrl).href,
        etag: key,
        size: buffer.length,
      };
    }

    const bucketUrl = this.config.s3.buckets[bucket];
    const { writeStream, uploadPromise } = streamableS3(this.s3, bucketUrl, key, mime, 'public-read');

    stream.pipe(writeStream);
    const { Location, ETag } = await uploadPromise;
    // TODO: add ContentType?
    const { ContentLength } = await this.s3.headObject({ Bucket: bucketUrl, Key: key }).promise();

    return { url: Location, etag: ETag, size: ContentLength ?? 0 };
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
