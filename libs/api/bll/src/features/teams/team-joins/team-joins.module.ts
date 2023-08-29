import { TeamJoinsService } from './team-joins.service';
import {
  TeamJoinsMutationResolver,
  TeamJoinsQueryAggregateResolver,
  TeamJoinsQueryResolver,
} from './team-joins.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamJoin } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamJoin])],
  providers: [TeamJoinsMutationResolver, TeamJoinsQueryResolver, TeamJoinsQueryAggregateResolver, TeamJoinsService],
  exports: [TeamJoinsService],
})
export class TeamJoinsModule {}
