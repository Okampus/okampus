import { Entity, OneToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { FileUpload } from './file-upload.entity';

@Entity()
export class Avatar extends BaseEntity {
  @PrimaryKey()
  avatarId!: number;

  @OneToOne()
  file!: FileUpload;

  constructor(options: {
    file: FileUpload;
  }) {
    super();
    this.file = options.file;
  }
}
