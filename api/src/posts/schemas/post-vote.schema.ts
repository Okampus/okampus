import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import type { Vote } from '../../shared/schemas/vote.schema';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import type { User } from '../../users/user.schema';
import { Post } from './post.schema';

@Schema()
export class PostVote extends Document implements Vote {
  @Prop({
    required: true,
    index: true,
    type: SchemaTypes.Number,
    ref: 'Post',
  })
  post: Post;

  kind: string;
  user: User;
  value: -1 | 1;
  updatedAt: Date;
  createdAt: Date;
}

export const PostVoteSchema = createSchemaForClass(PostVote);
