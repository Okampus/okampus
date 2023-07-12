import { EventApprovalStepsService } from './event-approval-steps.service';
import {
  EventApprovalStepsMutationResolver,
  EventApprovalStepsQueryAggregateResolver,
  EventApprovalStepsQueryResolver,
} from './event-approval-steps.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventApprovalStep } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventApprovalStep])],
  providers: [
    EventApprovalStepsMutationResolver,
    EventApprovalStepsQueryResolver,
    EventApprovalStepsQueryAggregateResolver,
    EventApprovalStepsService,
  ],
  exports: [EventApprovalStepsService],
})
export class EventApprovalStepsModule {}
