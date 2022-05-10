import path from 'node:path';
import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { config } from '../../shared/configs/config';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { User } from '../../users/user.entity';

@Entity()
export class FileUpload extends BaseEntity {
  @PrimaryKey()
  fileUploadId: string = nanoid(64);

  @ManyToOne()
  user!: User;

  @Property({ type: 'text' })
  name!: string;

  @Property()
  fileSize!: number;

  @Property({ type: 'text' })
  mimeType!: string;

  @Property()
  fileLastModifiedAt!: Date;

  @Property()
  validated = false;

  @Property({ type: 'text' })
  url: string;

  @Property()
  visible = false;

  @Enum(() => FileKind)
  fileKind!: FileKind;

  constructor(options: {
    user: User;
    name: string;
    fileSize: number;
    mimeType: string;
    fileLastModifiedAt: Date;
    fileKind: FileKind;
    url: string;
  }) {
    super();
    this.user = options.user;
    this.name = options.name;
    this.fileSize = options.fileSize;
    this.mimeType = options.mimeType;
    this.url = options.url;
    this.fileLastModifiedAt = options.fileLastModifiedAt;
    this.fileKind = options.fileKind;
  }

  public getPath(): string {
    return path.join(
      config.get('upload.path'),
      this.fileKind,
      `${this.fileUploadId.toString()}${path.extname(this.name)}`,
    );
  }
}
