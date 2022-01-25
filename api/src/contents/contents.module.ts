import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Content } from './content.entity';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Content, ContentMaster]),
  ],
  controllers: [ContentsController],
  providers: [CaslAbilityFactory, ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}
