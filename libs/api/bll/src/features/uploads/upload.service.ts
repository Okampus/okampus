import { Readable } from 'node:stream';
import { Injectable } from '@nestjs/common';
// import type { FileKind } from '@lib/types/enums/file-kind.enum';
// import { streamToBuffer } from '@lib/utils/stream-to-buffer';
// import type { Tenant } from '@tenants/tenant.entity';
// import type { User } from '@uaa/users/user.entity';
// import { FileUpload } from './file-upload.entity';
import { promises } from 'node:fs';

import { DocumentUpload, FileUploadOptions, ImageUpload, TenantCore, VideoUpload } from '@okampus/api/dal';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';
import { DocumentUploadType, S3Buckets } from '@okampus/shared/enums';
import { ApiConfig, MulterFileType } from '@okampus/shared/types';
import { snowflake, streamableS3, streamToBuffer } from '@okampus/shared/utils';
import { RequestContext } from '../../shards/global-request/request-context';
import path from 'node:path';
import { HTTPResource } from '../../shards/types/http-resource.type';
import { ConfigService } from '../../global/config.module';

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
      const fullPath = path.join(this.config.upload.path, bucket, key);
      await writeFile(fullPath, buffer);

      return { url: path.join(this.config.network.apiUrl, fullPath), etag: key };
    }

    const bucketUrl = this.config.s3.buckets[bucket];
    const { writeStream, uploadPromise } = streamableS3(this.s3, bucketUrl, key, mime, 'public-read');

    stream.pipe(writeStream);
    const { Location, ETag } = await uploadPromise;

    return { url: Location, etag: ETag };
  }

  public async createImageUpload(tenant: TenantCore, file: MulterFileType, bucket: S3Buckets): Promise<ImageUpload> {
    // TODO: safe validation
    // if (file.mimetype.startsWith('image/')) {
    const payload = await this.uploadFile(tenant, file, bucket);

    // Run in a separate event

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

    // TODO: manage types later
    return new DocumentUpload({ ...payload, documentType: DocumentUploadType.Document });
  }

  public async createVideoUpload(tenant: TenantCore, file: MulterFileType, bucket: S3Buckets): Promise<VideoUpload> {
    const payload = await this.uploadFile(tenant, file, bucket);

    return new VideoUpload(payload);
  }

  public async uploadFile(tenant: TenantCore, file: MulterFileType, bucket: S3Buckets): Promise<FileUploadOptions> {
    const id = snowflake();
    const mime = file.mimetype;
    const stream = file?.createReadStream?.() ?? Readable.from(file.buffer);
    const resource = await this.upload(stream, mime, id, bucket);

    return {
      id,
      tenant,
      uploadedBy: this.requester(),
      name: file.originalname ?? file.filename,
      size: file.size,
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
