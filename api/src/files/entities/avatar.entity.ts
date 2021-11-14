import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { FileUpload } from './file-upload.entity';

@Entity()
export class Avatar {
  @PrimaryKey()
  avatarId!: number;

  @OneToOne()
  file!: FileUpload;

  // TODO: Automatically update replacedAt of the last avatar when a new avatar is added
  @Property()
  updatedAt: Date = new Date();

  constructor(options: {
    file: FileUpload;
  }) {
    this.file = options.file;
  }
}
