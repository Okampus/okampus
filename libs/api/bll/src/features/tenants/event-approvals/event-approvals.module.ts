import { EventApprovalsService } from './event-approvals.service';
import {
  EventApprovalsMutationResolver,
  EventApprovalsQueryAggregateResolver,
  EventApprovalsQueryResolver,
} from './event-approvals.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventApproval } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventApproval])],
  providers: [
    EventApprovalsMutationResolver,
    EventApprovalsQueryResolver,
    EventApprovalsQueryAggregateResolver,
    EventApprovalsService,
  ],
  exports: [EventApprovalsService],
})
export class EventApprovalsModule {}
