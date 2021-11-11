import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Post } from '../../posts/entities/post.entity';
import { FileUpload } from './file-upload.entity';

@Entity()
export class FileIntegration {
  @PrimaryKey()
  integrationId!: number;

  @OneToOne()
  file!: FileUpload;

  // TODO: Create content table
  @ManyToOne()
  content!: Post;

  constructor(options: {
    file: FileUpload;
    content: Post;
  }) {
    this.file = options.file;
    this.content = options.content;
  }
}
