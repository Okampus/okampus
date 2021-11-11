import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CourseSubject } from './entities/course-subject.entity';
import { DocSeries } from './entities/doc-series.entity';
import { FileUpload } from './entities/file-upload.entity';
import { StudyDoc } from './entities/study-doc.entity';
import { FilesController } from './files.controller';
import { FilesService } from './services/file-uploads.service';
import { StudyDocsService } from './services/study-docs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CourseSubject,
      DocSeries,
      FileUpload,
      StudyDoc,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [FilesController],
  providers: [StudyDocsService, FilesService],
  exports: [StudyDocsService],
})
export class FilesModule {}
