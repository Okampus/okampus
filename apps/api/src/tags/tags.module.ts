import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from './tag.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tag]),
  ],
  controllers: [TagsController],
  providers: [CaslAbilityFactory, TagsService],
  exports: [TagsService],
})
export class TagsModule {}
