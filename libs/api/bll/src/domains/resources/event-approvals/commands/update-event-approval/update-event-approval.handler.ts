import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventApprovalFactory } from '../../../../factories/events/event-approval.factory';
import { EventApprovalModel } from '../../../../factories/events/event-approval.model';
import { UpdateEventApprovalCommand } from './update-event-approval.command';

@CommandHandler(UpdateEventApprovalCommand)
export class UpdateEventApprovalHandler implements ICommandHandler<UpdateEventApprovalCommand> {
  constructor(private readonly eventFactory: EventApprovalFactory) {}

  async execute(command: UpdateEventApprovalCommand): Promise<EventApprovalModel> {
    const { id, ...updateEventApproval } = command.updateEventApproval;
    // TODO: do stuff with supervisor ID/ refactor the whole update logic with an "ensureExist" find method
    return await this.eventFactory.update({ id, tenant: command.tenant }, command.populate, updateEventApproval, {});
  }
}
