import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantCore } from '@okampus/api/dal';
import { EventApprovalStepFactory } from '../../../../factories/events/event-approval-step.factory';
import { CreateEventApprovalStepCommand } from './create-event-approval-step.command';
import { EventApprovalStepModel } from '../../../../factories/events/event-approval-step.model';

@CommandHandler(CreateEventApprovalStepCommand)
export class CreateEventApprovalStepHandler implements ICommandHandler<CreateEventApprovalStepCommand> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(command: CreateEventApprovalStepCommand): Promise<EventApprovalStepModel> {
    return await this.eventApprovalStepFactory.createEventApprovalStep(
      command.createEventApprovalStep,
      { id: command.tenant.id } as TenantCore,
      command.requester
    );
  }
}
