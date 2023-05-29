import { EventAttendancesService } from './event-attendances.service';
import {
  EventAttendancesMutationResolver,
  EventAttendancesQueryAggregateResolver,
  EventAttendancesQueryResolver,
} from './event-attendances.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventAttendance } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([EventAttendance])],
  providers: [
    EventAttendancesMutationResolver,
    EventAttendancesQueryResolver,
    EventAttendancesQueryAggregateResolver,
    EventAttendancesService,
  ],
  exports: [EventAttendancesService],
})
export class EventAttendancesModule {}
