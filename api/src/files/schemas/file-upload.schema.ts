import path from 'node:path';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { config } from '../../config';
import { FileType } from '../../shared/types/file-kinds.enum';
import { createSchemaForClass } from '../../shared/utils/createSchemaForClass';
import { User } from '../../users/user.schema';

@Schema({ timestamps: true })
export class FileUpload extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  author: User;

  @Prop()
  originalName: string;

  @Prop()
  fileSize: number;

  @Prop()
  type: string;

  @Prop()
  lastModified: Date;

  @Prop({ default: false })
  validated: number;

  @Prop({ default: false })
  visible: boolean;

  @Prop({ default: FileType.Unknown })
  fileKind: string;

  createdAt: Date;
  _id: number;

  public filePath(): string {
    return path.join(config.get('uploadPath'), this.fileKind, this._id.toString());
  }
}

export const FileUploadSchema = createSchemaForClass(FileUpload);
