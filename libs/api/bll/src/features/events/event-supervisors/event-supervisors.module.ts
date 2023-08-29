import { EventSupervisorsService } from './event-supervisors.service';
import {
  EventSupervisorsMutationResolver,
  EventSupervisorsQueryAggregateResolver,
  EventSupervisorsQueryResolver,
} from './event-supervisors.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventSupervisor } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventSupervisor])],
  providers: [
    EventSupervisorsMutationResolver,
    EventSupervisorsQueryResolver,
    EventSupervisorsQueryAggregateResolver,
    EventSupervisorsService,
  ],
  exports: [EventSupervisorsService],
})
export class EventSupervisorsModule {}
