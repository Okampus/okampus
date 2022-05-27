import { promises as fs } from 'node:fs';
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import type { Express } from 'express';
import { InjectS3 } from 'nestjs-s3';
import { computedConfig, config } from '../../shared/configs/config';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { UploadBucket } from '../../shared/lib/types/enums/upload-bucket.enum';

@Injectable()
export class FilePersistanceService {
  private static readonly fileKindBucket = {
    [FileKind.Attachment]: UploadBucket.Attachments,
    [FileKind.TeamFile]: UploadBucket.TeamFiles,
    [FileKind.InfoDoc]: UploadBucket.Documents,
    [FileKind.ProfileImage]: UploadBucket.ProfileImages,
    [FileKind.StudyDoc]: UploadBucket.Documents,
  };

  constructor(
    @InjectS3() private readonly s3: S3,
  ) {}

  public async upload(
    file: Express.Multer.File,
    { path, key, kind }: { path: string; key: string; kind: FileKind },
  ): Promise<{ url: string; etag: string }> {
    if (!config.get('storage.enabled')) {
      await fs.writeFile(path, file.buffer);
      return { url: `${computedConfig.apiUrl}/${path}`, etag: key };
    }

    const params: S3.PutObjectRequest = {
      /* eslint-disable @typescript-eslint/naming-convention */
      ACL: 'public-read',
      Bucket: FilePersistanceService.fileKindBucket[kind],
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      /* eslint-enable @typescript-eslint/naming-convention */
    };

    const object = await this.s3.upload(params).promise();
    return {
      url: object.Location,
      etag: object.ETag,
    };
  }
}
