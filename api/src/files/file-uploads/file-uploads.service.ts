import { promises as fs } from 'node:fs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { FileKind } from '../../shared/lib/types/file-kind.enum';
import type { User } from '../../users/user.entity';
import { FileUpload } from './file-upload.entity';

@Injectable()
export class FileUploadsService {
  constructor(
    @InjectRepository(FileUpload) private readonly fileUploadRepository: BaseRepository<FileUpload>,
  ) {}

  public async findOne(fileUploadId: string): Promise<FileUpload> {
    // TODO: Maybe the user won't have access to this file. There can be some restrictions
    // (i.e. "sensitive"/"removed" files)
    return await this.fileUploadRepository.findOneOrFail({ fileUploadId }, ['user']);
  }

  public async create(
    user: User,
    file: Express.Multer.File,
    fileKind: FileKind,
    fileLastModifiedAt = new Date(),
  ): Promise<FileUpload> {
    const fileDocument = new FileUpload({
      user,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileKind,
      fileLastModifiedAt,
    });

    await this.fileUploadRepository.persistAndFlush(fileDocument);
    await fs.writeFile(fileDocument.getPath(), file.buffer);

    return fileDocument;
  }
}
