import { DeleteEventApprovalStepCommand } from './delete-event-approval-step.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteEventApprovalStepCommand)
export class DeleteEventApprovalStepHandler implements ICommandHandler<DeleteEventApprovalStepCommand> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(command: DeleteEventApprovalStepCommand): Promise<boolean> {
    return await this.eventApprovalStepFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
