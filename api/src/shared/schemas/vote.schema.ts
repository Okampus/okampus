import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/user.schema';
import { createSchemaForClass } from '../utils/createSchemaForClass';

@Schema({ timestamps: true, discriminatorKey: 'kind' })
export class Vote extends Document {
  @Prop({ type: String, required: true })
  kind: string;

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

export const VoteSchema = createSchemaForClass(Vote);
