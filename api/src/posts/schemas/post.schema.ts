import { Prop, Schema } from '@nestjs/mongoose';
import { Document, HookNextFunction, SchemaTypes } from 'mongoose';
import { PreHook } from '../../shared/decorators/mongoose-hooks.decorator';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import { User } from '../../users/user.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ index: true })
  postId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: false })
  archived: boolean;

  @Prop({ default: true })
  opened: boolean;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  dislikes: number;

  @Prop({ default: null, type: Date })
  contentLastEditedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
  _id: number;

  @PreHook('save')
  public saveHook(next: HookNextFunction): void {
    if (this.isModified('body') || this.isModified('title'))
      this.contentLastEditedAt = new Date();
    next();
  }
}

export const PostSchema = createSchemaForClass(Post);
