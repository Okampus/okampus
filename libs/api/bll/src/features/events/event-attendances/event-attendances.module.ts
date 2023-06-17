import { EventAttendancesService } from './event-attendances.service';
import {
  EventAttendancesMutationResolver,
  EventAttendancesQueryAggregateResolver,
  EventAttendancesQueryResolver,
} from './event-attendances.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventAttendance } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventAttendance])],
  providers: [
    EventAttendancesMutationResolver,
    EventAttendancesQueryResolver,
    EventAttendancesQueryAggregateResolver,
    EventAttendancesService,
  ],
  exports: [EventAttendancesService],
})
export class EventAttendancesModule {}
