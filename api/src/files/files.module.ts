import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AttachmentsModule } from './attachments/attachments.module';
import { FileUploadsModule } from './file-uploads/file-uploads.module';
import { GalleriesModule } from './galleries/gallery.module';
import { InfoDocsModule } from './info-docs/info-docs.module';
import { ProfileImagesModule } from './profile-images/profile-images.module';
import { StudyDocsModule } from './study-docs/study-docs.module';

@Module({
  imports: [
    RouterModule.register([{
      path: 'files',
      children: [
        { path: 'attachments', module: AttachmentsModule },
        { path: 'galleries', module: GalleriesModule },
        { path: 'uploads', module: FileUploadsModule },
        { path: 'study-docs', module: StudyDocsModule },
        { path: 'info-docs', module: InfoDocsModule },
        { path: 'profile-images', module: ProfileImagesModule },
      ],
    }]),
    AttachmentsModule,
    FileUploadsModule,
    GalleriesModule,
    StudyDocsModule,
    InfoDocsModule,
    ProfileImagesModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class FilesModule {}
