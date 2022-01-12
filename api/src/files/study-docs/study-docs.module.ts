import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Subject } from '../../subjects/subject.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { StudyDoc } from './study-doc.entity';
import { StudyDocSearchService } from './study-docs-search.service';
import { StudyDocsController } from './study-docs.controller';
import { StudyDocsService } from './study-docs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([StudyDoc, Subject, DocSeries]),
    FileUploadsModule,
  ],
  controllers: [StudyDocsController],
  providers: [CaslAbilityFactory, StudyDocsService, StudyDocSearchService],
  exports: [StudyDocsService],
})
export class StudyDocsModule implements OnModuleInit {
  constructor(
    private readonly studyDocSearchService: StudyDocSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.studyDocSearchService.init();
  }
}
