import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Class } from '@classes/class.entity';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { DocSeries } from '@upload/doc-series/doc-series.entity';
import { FileUploadsModule } from '@upload/file-uploads/file-uploads.module';
import { InfoDoc } from './info-doc.entity';
import { InfoDocsController } from './info-docs.controller';
import { InfoDocsService } from './info-docs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([InfoDoc, DocSeries, Class]),
    FileUploadsModule,
  ],
  controllers: [InfoDocsController],
  providers: [CaslAbilityFactory, InfoDocsService],
  exports: [InfoDocsService],
})
export class InfoDocsModule {}
