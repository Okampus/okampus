import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import type { Vote } from '../../shared/schemas/vote.schema';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import type { User } from '../../users/user.schema';
import { Comment } from './comment.schema';

@Schema()
export class CommentVote extends Document implements Vote {
  @Prop({
    required: true,
    index: true,
    type: SchemaTypes.String,
    ref: 'Comment',
  })
  comment: Comment;

  kind: string;
  user: User;
  value: -1 | 1;
  updatedAt: Date;
  createdAt: Date;
}

export const CommentVoteSchema = createSchemaForClass(CommentVote);
