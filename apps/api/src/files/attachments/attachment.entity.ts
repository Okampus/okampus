import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import type { Content } from '../../contents/entities/content.entity';
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class Attachment extends BaseFileEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

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
