import { TagsService } from './tags.service';
import { TagsQueryAggregateResolver, TagsQueryResolver } from './tags.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { LogsModule } from '../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Tag } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Tag])],
  providers: [TagsQueryResolver, TagsQueryAggregateResolver, TagsService],
  exports: [TagsService],
})
export class TagsModule {}
