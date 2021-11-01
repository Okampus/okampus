import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';

@Schema({ timestamps: true })
export class CourseSubject extends Document {
  @Prop()
  courseCode: string;

  @Prop()
  name: string;

  @Prop()
  englishName: string;

  @Prop({ default: '' })
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

export const CourseSubjectSchema = createSchemaForClass(CourseSubject);
