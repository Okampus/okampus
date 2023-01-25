import { Module } from '@nestjs/common';
import { EventApprovalsService } from './event-approvals.service';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, TenantEvent } from '@okampus/api/dal';
import { CreateEventApprovalHandler } from './commands/create-event-approval/create-event-approval.handler';
import { GetEventApprovalByIdHandler } from './queries/get-event-approval-by-id/get-event-approval-by-id.handler';
import { UpdateEventApprovalHandler } from './commands/update-event-approval/update-event-approval.handler';
import { DeleteEventApprovalHandler } from './commands/delete-event-approval/delete-event-approval.handler';
import { EventApprovalsResolver } from './event-approvals.resolver';
import { GetEventApprovalsHandler } from './queries/get-event-approvals/get-event-approvals.handler';

const commandHandlers = [CreateEventApprovalHandler, UpdateEventApprovalHandler, DeleteEventApprovalHandler];
const queryHandlers = [GetEventApprovalByIdHandler, GetEventApprovalsHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([TenantEvent, Actor])],
  providers: [EventApprovalsResolver, EventApprovalsService, ...commandHandlers, ...queryHandlers],
  exports: [EventApprovalsService],
})
export class EventApprovalsModule {}
