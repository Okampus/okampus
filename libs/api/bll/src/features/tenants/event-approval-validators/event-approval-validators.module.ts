import { EventApprovalValidatorsService } from './event-approval-validators.service';
import {
  EventApprovalValidatorsMutationResolver,
  EventApprovalValidatorsQueryAggregateResolver,
  EventApprovalValidatorsQueryResolver,
} from './event-approval-validators.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventApprovalValidator } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventApprovalValidator])],
  providers: [
    EventApprovalValidatorsMutationResolver,
    EventApprovalValidatorsQueryResolver,
    EventApprovalValidatorsQueryAggregateResolver,
    EventApprovalValidatorsService,
  ],
  exports: [EventApprovalValidatorsService],
})
export class EventApprovalValidatorsModule {}
