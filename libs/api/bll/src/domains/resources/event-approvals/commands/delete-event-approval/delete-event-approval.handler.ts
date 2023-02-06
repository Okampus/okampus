import { DeleteEventApprovalCommand } from './delete-event-approval.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteEventApprovalCommand)
export class DeleteEventApprovalHandler implements ICommandHandler<DeleteEventApprovalCommand> {
  constructor(private readonly eventApprovalFactory: EventApprovalFactory) {}

  async execute(command: DeleteEventApprovalCommand): Promise<boolean> {
    return await this.eventApprovalFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
