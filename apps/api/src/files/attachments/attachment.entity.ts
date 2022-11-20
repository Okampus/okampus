import {
  Entity,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import type { Content } from '../../create/contents/entities/content.entity';
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class Attachment extends BaseFileEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @ManyToOne()
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
