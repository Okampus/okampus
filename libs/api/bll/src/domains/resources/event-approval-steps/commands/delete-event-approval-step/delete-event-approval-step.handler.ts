import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';
import { DeleteEventApprovalStepCommand } from './delete-event-approval-step.command';

@CommandHandler(DeleteEventApprovalStepCommand)
export class DeleteEventApprovalStepHandler implements ICommandHandler<DeleteEventApprovalStepCommand> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(command: DeleteEventApprovalStepCommand): Promise<boolean> {
    return await this.eventApprovalStepFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
