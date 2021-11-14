import { promises as fs } from 'node:fs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { FileKind } from '../../shared/lib/types/file-kind.enum';
import type { User } from '../../users/user.entity';
import { FileUpload } from '../entities/file-upload.entity';

@Injectable()
export class FileUploadsService {
  constructor(
    @InjectRepository(FileUpload) private readonly fileUploadRepository: BaseRepository<FileUpload>,
  ) {}

  public async getUploadById(fileUploadId: number): Promise<FileUpload | null> {
    return await this.fileUploadRepository.findOne({ fileUploadId });
  }

  public async create(
    author: User,
    file: Express.Multer.File,
    fileKind: FileKind,
    fileLastModifiedAt = new Date(),
  ): Promise<FileUpload> {
    const fileDocument = new FileUpload({
      author,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileKind,
      fileLastModifiedAt,
    });

    await fs.writeFile(fileDocument.getPath(), file.buffer);
    await this.fileUploadRepository.persistAndFlush(fileDocument);

    return fileDocument;
  }
}
