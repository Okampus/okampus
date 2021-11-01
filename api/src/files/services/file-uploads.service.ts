import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Express } from 'express';
import { Model } from 'mongoose';
import { config } from '../../config';
import { FileType } from '../../shared/types/file-kinds.enum';
import type { User } from '../../users/user.schema';
import { FileUpload } from '../schemas/file-upload.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileUpload.name) private readonly fileUploadModel: Model<FileUpload>,
  ) {}

  public async getUploadByName(name: string): Promise<FileUpload | null> {
    return await this.fileUploadModel.findOne({ uploadName: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  public async validateUploadByName(uploadName: string): Promise<FileUpload> {
    const upload = await this.getUploadByName(uploadName);
    if (!upload)
      throw new NotFoundException('Upload not found');

    return upload;
  }

  public async getUploadById(id: string): Promise<FileUpload | null> {
    return await this.fileUploadModel.findById(id);
  }

  public async validateUploadById(id: string): Promise<FileUpload> {
    const upload = await this.getUploadById(id);
    if (!upload)
      throw new NotFoundException('Upload not found');

    return upload;
  }

  public async create(
    author: User,
    file: Express.Multer.File,
    fileType: FileType,
    fileLastModifiedAt = new Date(),
  ): Promise<FileUpload> {
    const fileDocument = await this.fileUploadModel.create({
      author,
      originalName: file.originalname,
      fileSize: file.size,
      fileKind: FileType.StudyDocs,
      type: file.mimetype,
      fileLastModifiedAt,
    });

    await fs.writeFile(
      path.join(config.get('uploadPath'), fileType, `${fileDocument._id.toString()}${path.extname(file.originalname)}`),
      file.buffer,
    );

    return await fileDocument.save();
  }
}
