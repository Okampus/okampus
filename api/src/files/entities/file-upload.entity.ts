import path from 'node:path';
import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { config } from '../../config';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { User } from '../../users/user.entity';

@Entity()
export class FileUpload {
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

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt = new Date();

  constructor(options: {
    author: User;
    originalName: string;
    fileSize: number;
    mimeType: string;
    fileLastModifiedAt: Date;
    fileKind?: FileKind;
  }) {
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
