import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { Post } from '../../posts/entities/post.entity';
import { Reply } from '../../replies/entities/reply.entity';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';
import type { ContentOptions } from './content-options-xor.type';

@Entity()
export class Attachment extends BaseEntity {
  @PrimaryKey()
  attachmentId: string = nanoid(32);

  @OneToOne()
  file!: FileUpload;

  @ManyToOne()
  post?: Post;

  @ManyToOne()
  reply?: Reply;

  constructor(options: ContentOptions & { file: FileUpload }) {
    super();
    this.file = options.file;
    if (options.post)
      this.post = options.post;
    else if (options.reply)
      this.reply = options.reply;
  }
}
