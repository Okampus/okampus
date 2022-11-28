import type { Readable } from 'node:stream';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import sharp from 'sharp';
import { BaseRepository } from '@common/lib/orm/base.repository';
import type { FileKind } from '@common/lib/types/enums/file-kind.enum';
import { streamToBuffer } from '@common/lib/utils/stream-to-buffer';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import type { User } from '@modules/uua/users/user.entity';
import { FilePersistanceService } from './file-persistance.service';
import { FileUpload } from './file-upload.entity';

@Injectable()
export class FileUploadsService {
  constructor(
    @InjectRepository(FileUpload) private readonly fileUploadRepository: BaseRepository<FileUpload>,
    private readonly filePersistanceService: FilePersistanceService,
  ) {}

  public async findOne(id: string): Promise<FileUpload> {
    // TODO: Maybe the user won't have access to this file. There can be some restrictions
    // (i.e. "sensitive"/"removed" files)
    return await this.fileUploadRepository.findOneOrFail({ id }, { populate: ['user'] });
  }

  public async create(
    tenant: Tenant,
    user: User,
    file: MulterFile | MulterFile & { createReadStream: () => Readable | undefined },
    fileKind: FileKind,
    fileLastModifiedAt = new Date(),
  ): Promise<FileUpload> {
    let buffer = file.buffer
    ?? (await streamToBuffer((file as MulterFile & { createReadStream: () => Readable }).createReadStream()));

    let mimeType = file.mimetype;
    let meta = {};
    if (file.mimetype.startsWith('image/')) {
      const image = sharp(buffer);
      buffer = await image.resize(null, 600).webp({ effort: 3 }).toBuffer();
      mimeType = 'image/webp';
      const metadata = await image.metadata();
      meta = { width: metadata.width, height: metadata.height };
    }

    const fileDocument = new FileUpload({
      tenant,
      user,
      name: file.originalname ?? file.filename,
      fileSize: Buffer.byteLength(buffer),
      mimeType,
      fileKind,
      fileLastModifiedAt,
      url: '',
      ...meta,
    });

    await this.fileUploadRepository.persistAndFlush(fileDocument);

    const infos = await this.filePersistanceService.upload(buffer, mimeType, {
      path: fileDocument.getPath(),
      key: fileDocument.id,
      kind: fileKind,
    });

    fileDocument.url = infos.url;

    return fileDocument;
  }
}
