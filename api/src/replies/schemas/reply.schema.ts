import { Prop, Schema } from '@nestjs/mongoose';
import type { CallbackError } from 'mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { nanoid } from 'nanoid';
import type { Comment } from '../../comments/schemas/comment.schema';
import type { Post } from '../../posts/schemas/post.schema';
import { PreHook } from '../../shared/decorators/mongoose-hooks.decorator';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import { User } from '../../users/user.schema';

@Schema({ timestamps: true })
export class Reply extends Document {
  @Prop({ default: () => nanoid(8) })
  _id: string;

  @Prop({ required: true, type: SchemaTypes.String, ref: 'Comment' })
  comment: Comment | string;

  @Prop({ required: true, type: SchemaTypes.Number, ref: 'Post' })
  post: Post | number;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ default: null, type: Date })
  contentLastEditedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  @PreHook('save')
  public saveHook(next: (err?: CallbackError) => void): void {
    if (this.isModified('body'))
      this.contentLastEditedAt = new Date();
    next();
  }
}

export const ReplySchema = createSchemaForClass(Reply);
