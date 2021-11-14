import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Post } from '../../posts/entities/post.entity';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { FileUpload } from './file-upload.entity';

@Entity()
export class Attachment extends BaseEntity {
  @PrimaryKey()
  attachmentId!: number;

  @OneToOne()
  file!: FileUpload;

  // TODO: Create content table
  @ManyToOne()
  content!: Post;

  constructor(options: {
    file: FileUpload;
    content: Post;
  }) {
    super();
    this.file = options.file;
    this.content = options.content;
  }
}
