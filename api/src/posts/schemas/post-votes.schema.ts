import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import { User } from '../../users/user.schema';
import { Post } from './post.schema';

@Schema({ timestamps: true })
export class PostVotes extends Document {
  @Prop({
    required: true,
    index: true,
    type: SchemaTypes.Number,
    ref: 'Post',
  })
  post: Post;

  @Prop({
    required: true,
    index: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({ required: true, type: Number, enum: [-1, 1] })
  value: -1 | 1;

  createdAt: Date;
  updatedAt: Date;
}

export const PostVotesSchema = createSchemaForClass(PostVotes);
