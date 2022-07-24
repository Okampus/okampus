import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { TagSearchService } from './tag-search.service';
import { Tag } from './tag.entity';
import { TagsController } from './tags.controller';
import { TagsResolver } from './tags.resolver';
import { TagsService } from './tags.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tag]),
  ],
  controllers: [TagsController],
  providers: [CaslAbilityFactory, TagsService, TagSearchService, TagsResolver],
  exports: [TagsService],
})
export class TagsModule implements OnModuleInit {
  constructor(
    private readonly tagSearchService: TagSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.tagSearchService.init();
  }
}
