import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AttachmentsModule } from './attachments/attachments.module';
import { FileUploadsModule } from './file-uploads/file-uploads.module';
import { InfoDocsModule } from './info-docs/info-docs.module';
import { StudyDocsModule } from './study-docs/study-docs.module';
import { TeamFilesModule } from './team-files/team-files.module';
import { TeamGalleriesModule } from './team-galleries/team-gallery.module';
import { TeamReceiptsModule } from './team-receipts/team-receipts.module';

@Module({
  imports: [
    RouterModule.register([{
      path: 'files',
      children: [
        { path: 'attachments', module: AttachmentsModule },
        { path: 'team-files', module: TeamFilesModule },
        { path: 'team-galleries', module: TeamGalleriesModule },
        { path: 'team-receipts', module: TeamReceiptsModule },
        { path: 'uploads', module: FileUploadsModule },
        { path: 'study-docs', module: StudyDocsModule },
        { path: 'info-docs', module: InfoDocsModule },
      ],
    }]),
    AttachmentsModule,
    FileUploadsModule,
    TeamFilesModule,
    TeamGalleriesModule,
    TeamReceiptsModule,
    StudyDocsModule,
    InfoDocsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class FilesModule {}
