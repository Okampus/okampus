import { EventApprovalsService } from './event-approvals.service';
import { CreateEventApprovalHandler } from './commands/create-event-approval/create-event-approval.handler';
import { GetEventApprovalByIdHandler } from './queries/get-event-approval-by-id/get-event-approval-by-id.handler';
import { UpdateEventApprovalHandler } from './commands/update-event-approval/update-event-approval.handler';
import { DeleteEventApprovalHandler } from './commands/delete-event-approval/delete-event-approval.handler';
import { EventApprovalsResolver } from './event-approvals.resolver';
import { GetEventApprovalsHandler } from './queries/get-event-approvals/get-event-approvals.handler';
import { Actor, TenantEvent } from '@okampus/api/dal';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

const commandHandlers = [CreateEventApprovalHandler, UpdateEventApprovalHandler, DeleteEventApprovalHandler];
const queryHandlers = [GetEventApprovalByIdHandler, GetEventApprovalsHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([TenantEvent, Actor])],
  providers: [EventApprovalsResolver, EventApprovalsService, ...commandHandlers, ...queryHandlers],
  exports: [EventApprovalsService],
})
export class EventApprovalsModule {}
