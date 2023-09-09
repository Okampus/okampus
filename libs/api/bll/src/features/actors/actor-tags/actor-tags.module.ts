import { ActorTagsService } from './actor-tags.service';
import {
  ActorTagsMutationResolver,
  ActorTagsQueryAggregateResolver,
  ActorTagsQueryResolver,
} from './actor-tags.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ActorTag } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([ActorTag])],
  providers: [ActorTagsMutationResolver, ActorTagsQueryResolver, ActorTagsQueryAggregateResolver, ActorTagsService],
  exports: [ActorTagsService],
})
export class ActorTagsModule {}
