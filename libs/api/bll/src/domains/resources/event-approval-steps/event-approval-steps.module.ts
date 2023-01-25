import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, TenantEvent } from '@okampus/api/dal';
import { CreateEventApprovalStepHandler } from './commands/create-event-approval-step/create-event-approval-step.handler';
import { UpdateEventApprovalStepHandler } from './commands/update-event-approval-step/update-event-approval-step.handler';
import { DeleteEventApprovalStepHandler } from './commands/delete-event-approval-step/delete-event-approval-step.handler';
import { GetEventApprovalStepsHandler } from './queries/get-event-approval-steps/get-event-approval-steps.handler';
import { GetEventApprovalStepByIdHandler } from './queries/get-event-approval-step-by-id/get-event-approval-step-by-id.handler';
import { EventApprovalStepsResolver } from './event-approval-steps.resolver';
import { EventApprovalStepsService } from './event-approval-steps.service';

const commandHandlers = [
  CreateEventApprovalStepHandler,
  UpdateEventApprovalStepHandler,
  DeleteEventApprovalStepHandler,
];
const queryHandlers = [GetEventApprovalStepByIdHandler, GetEventApprovalStepsHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([TenantEvent, Actor])],
  providers: [EventApprovalStepsResolver, EventApprovalStepsService, ...commandHandlers, ...queryHandlers],
  exports: [EventApprovalStepsService],
})
export class EventApprovalStepsModule {}
