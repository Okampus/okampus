import { EventJoinsService } from './event-joins.service';
import { 
  EventJoinsMutationResolver,
  EventJoinsQueryAggregateResolver, 
  EventJoinsQueryResolver
} from './event-joins.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventJoin } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventJoin])],
  providers: [
    EventJoinsMutationResolver,
    EventJoinsQueryResolver, 
    EventJoinsQueryAggregateResolver,
    EventJoinsService
  ],
  exports: [EventJoinsService],
})
export class EventJoinsModule {}