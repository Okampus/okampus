import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import type { Vote } from '../../shared/schemas/vote.schema';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import type { User } from '../../users/user.schema';
import { Reply } from './reply.schema';

@Schema()
export class ReplyVote extends Document implements Vote {
  @Prop({
    required: true,
    index: true,
    type: SchemaTypes.String,
    ref: 'Reply',
  })
  reply: Reply;

  kind: string;
  user: User;
  value: -1 | 1;
  updatedAt: Date;
  createdAt: Date;
}

export const ReplyVoteSchema = createSchemaForClass(ReplyVote);
