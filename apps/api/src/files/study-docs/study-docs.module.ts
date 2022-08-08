import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Subject } from '../../subjects/subject.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { StudyDoc } from './study-doc.entity';
import { StudyDocsController } from './study-docs.controller';
import { StudyDocsService } from './study-docs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([StudyDoc, Subject, DocSeries]),
    FileUploadsModule,
  ],
  controllers: [StudyDocsController],
  providers: [CaslAbilityFactory, StudyDocsService],
  exports: [StudyDocsService],
})
export class StudyDocsModule {}
