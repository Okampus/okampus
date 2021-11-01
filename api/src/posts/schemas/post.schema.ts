import { Prop, Schema } from '@nestjs/mongoose';
import type { CallbackError } from 'mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { PreHook } from '../../shared/decorators/mongoose-hooks.decorator';
import { PostTypes } from '../../shared/types/post-types.enum';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import { User } from '../../users/user.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [String], required: false, default: [] })
  tags: string[];

  @Prop({ required: true, enum: PostTypes, type: Number })
  type: PostTypes;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: false })
  locked: boolean;

  @Prop({ default: true })
  opened: boolean;

  // TODO: Add full 'views' support
  @Prop({ default: 0 })
  views: number;

  // TODO: Add full 'favorites' support
  @Prop({ default: 0 })
  favorites: number;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ default: null, type: Date })
  contentLastEditedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
  _id: number;

  @PreHook('save')
  public saveHook(next: (err?: CallbackError) => void): void {
    if (this.isModified('body') || this.isModified('title'))
      this.contentLastEditedAt = new Date();
    next();
  }
}

export const PostSchema = createSchemaForClass(Post);
