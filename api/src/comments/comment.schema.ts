import { Prop, Schema } from '@nestjs/mongoose';
import { Document, HookNextFunction, SchemaTypes } from 'mongoose';
import { nanoid } from 'nanoid';
import { PreHook } from '../shared/decorators/mongoose-hooks.decorator';
import { createSchemaForClass } from '../shared/utils/createSchemaForClass';
import { User } from '../users/user.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ default: () => nanoid(8) })
  _id: string;

  @Prop({ index: true })
  postId: number;

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
  public saveHook(next: HookNextFunction): void {
    if (this.isModified('body'))
      this.contentLastEditedAt = new Date();
    next();
  }
}

export const CommentSchema = createSchemaForClass(Comment);
