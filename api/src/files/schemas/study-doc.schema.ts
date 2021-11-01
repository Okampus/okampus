import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import { CourseSubject } from './course-subject.schema';
import { FileUpload } from './file-upload.schema';

@Schema({ timestamps: true })
export class StudyDoc extends Document {
  @Prop({ required: true, type: Number, ref: 'FileUpload' })
  file: FileUpload;

  @Prop({ default: null, type: String })
  name: string | null;

  @Prop({ default: null, type: Number })
  year: number | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseSubject', default: null })
  subject: CourseSubject;

  @Prop({ type: [String], required: false, default: [] })
  tags: string[];

  @Prop({ default: '' })
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

export const StudyDocSchema = createSchemaForClass(StudyDoc);
