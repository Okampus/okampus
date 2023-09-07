import { TeamHistoriesService } from './team-histories.service';
import {
  TeamHistoriesMutationResolver,
  TeamHistoriesQueryAggregateResolver,
  TeamHistoriesQueryResolver
} from './team-histories.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamHistory } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamHistory])],
  providers: [
    TeamHistoriesMutationResolver,
    TeamHistoriesQueryResolver,
    TeamHistoriesQueryAggregateResolver,
    TeamHistoriesService
  ],
  exports: [TeamHistoriesService],
})
export class TeamHistoriesModule {}