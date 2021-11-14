import path from 'node:path';
import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { config } from '../../config';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { User } from '../../users/user.entity';

@Entity()
export class FileUpload extends BaseEntity {
  @PrimaryKey()
  fileUploadId!: number;

  @ManyToOne()
  author!: User;

  @Property({ type: 'text' })
  originalName!: string;

  @Property()
  fileSize!: number;

  @Property({ type: 'text' })
  mimeType!: string;

  @Property()
  fileLastModifiedAt!: Date;

  @Property()
  validated = false;

  @Property()
  visible = false;

  @Enum(() => FileKind)
  fileKind = FileKind.Unknown;

  constructor(options: {
    author: User;
    originalName: string;
    fileSize: number;
    mimeType: string;
    fileLastModifiedAt: Date;
    fileKind?: FileKind;
  }) {
    super();
    this.author = options.author;
    this.originalName = options.originalName;
    this.fileSize = options.fileSize;
    this.mimeType = options.mimeType;
    this.fileLastModifiedAt = options.fileLastModifiedAt;

    if (options.fileKind)
      this.fileKind = options.fileKind;
  }

  public getPath(): string {
    return path.join(
      config.get('uploadPath'),
      this.fileKind,
      `${this.fileUploadId.toString()}.${path.extname(this.originalName)}`,
    );
  }
}
