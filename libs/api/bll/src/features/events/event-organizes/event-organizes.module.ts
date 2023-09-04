import { EventOrganizesService } from './event-organizes.service';
import {
  EventOrganizesMutationResolver,
  EventOrganizesQueryAggregateResolver,
  EventOrganizesQueryResolver
} from './event-organizes.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventOrganize } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventOrganize])],
  providers: [
    EventOrganizesMutationResolver,
    EventOrganizesQueryResolver,
    EventOrganizesQueryAggregateResolver,
    EventOrganizesService
  ],
  exports: [EventOrganizesService],
})
export class EventOrganizesModule {}