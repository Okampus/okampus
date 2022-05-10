import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { InfoDoc } from './info-doc.entity';
import { InfoDocSearchService } from './info-docs-search.service';
import { InfoDocsController } from './info-docs.controller';
import { InfoDocsService } from './info-docs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([InfoDoc, DocSeries]),
    FileUploadsModule,
  ],
  controllers: [InfoDocsController],
  providers: [CaslAbilityFactory, InfoDocsService, InfoDocSearchService],
  exports: [InfoDocsService],
})
export class InfoDocsModule implements OnModuleInit {
  constructor(
    private readonly infoDocSearchService: InfoDocSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.infoDocSearchService.init();
  }
}
