import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';
import { DeleteEventApprovalCommand } from './delete-event-approval.command';

@CommandHandler(DeleteEventApprovalCommand)
export class DeleteEventApprovalHandler implements ICommandHandler<DeleteEventApprovalCommand> {
  constructor(private readonly eventApprovalFactory: EventApprovalFactory) {}

  async execute(command: DeleteEventApprovalCommand): Promise<boolean> {
    return await this.eventApprovalFactory.delete({ id: command.id, tenant: command.tenant });
  }
}