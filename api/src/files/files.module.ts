import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import type { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/users.module';
import { FilesController } from './files.controller';
import { CourseSubject, CourseSubjectSchema } from './schemas/course-subject.schema';
import { FileUpload, FileUploadSchema } from './schemas/file-upload.schema';
import { StudyDoc, StudyDocSchema } from './schemas/study-doc.schema';
import { FilesService } from './services/file-uploads.service';
import { StudyDocsService } from './services/study-docs.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: StudyDoc.name,
        useFactory: (): Schema => {
          const schema = StudyDocSchema;
          schema.plugin(autoIncrement, { model: 'StudyDoc', startAt: 1 });
          schema.plugin(paginate);
          return schema;
        },
      },
      {
        name: FileUpload.name,
        useFactory: (): Schema => {
          const schema = FileUploadSchema;
          schema.plugin(autoIncrement, { model: 'FileUpload', startAt: 1 });
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([{ name: CourseSubject.name, schema: CourseSubjectSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [FilesController],
  providers: [StudyDocsService, FilesService],
  exports: [StudyDocsService],
})
export class FilesModule {}
