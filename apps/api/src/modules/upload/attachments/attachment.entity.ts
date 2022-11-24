import {
  Entity,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '@common/lib/entities/base-file-entity';
import { Content } from '@modules/create/contents/entities/content.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class Attachment extends BaseFileEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @ManyToOne({ type: Content, nullable: true })
  content: Content | null = null;

  constructor(options: {
    file: FileUpload;
    content?: Content | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}
