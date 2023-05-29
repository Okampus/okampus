import { TagsService } from './tags.service';
import { TagsMutationResolver, TagsQueryAggregateResolver, TagsQueryResolver } from './tags.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Tag } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Tag])],
  providers: [TagsMutationResolver, TagsQueryResolver, TagsQueryAggregateResolver, TagsService],
  exports: [TagsService],
})
export class TagsModule {}
