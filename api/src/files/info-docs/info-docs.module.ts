import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { DocSeries } from '../doc-series/doc-series.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { InfoDoc } from './info-doc.entity';
import { InfoDocsController } from './info-docs.controller';
import { InfoDocsService } from './info-docs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([InfoDoc, DocSeries]),
    FileUploadsModule,
  ],
  controllers: [InfoDocsController],
  providers: [CaslAbilityFactory, InfoDocsService],
  exports: [InfoDocsService],
})
export class InfoDocsModule {}
