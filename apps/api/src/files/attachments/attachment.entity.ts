import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { Content } from '../../contents/entities/content.entity';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class Attachment extends BaseEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne()
  content?: Content;

  constructor(options: {
    file: FileUpload;
    content?: Content;
  }) {
    super();
    this.file = options.file;

    if (options.content)
      this.content = options.content;
  }
}
