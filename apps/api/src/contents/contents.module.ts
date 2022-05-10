import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { ContentEdit } from './entities/content-edit.entity';
import { Content } from './entities/content.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Content, ContentEdit, ContentMaster]),
  ],
  controllers: [ContentsController],
  providers: [CaslAbilityFactory, ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}
