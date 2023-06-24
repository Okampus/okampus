import { MissionJoinsService } from './mission-joins.service';
import {
  MissionJoinsMutationResolver,
  MissionJoinsQueryAggregateResolver,
  MissionJoinsQueryResolver,
} from './mission-joins.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MissionJoin } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([MissionJoin])],
  providers: [
    MissionJoinsMutationResolver,
    MissionJoinsQueryResolver,
    MissionJoinsQueryAggregateResolver,
    MissionJoinsService,
  ],
  exports: [MissionJoinsService],
})
export class MissionJoinsModule {}
