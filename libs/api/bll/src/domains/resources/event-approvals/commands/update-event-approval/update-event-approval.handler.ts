import { UpdateEventApprovalCommand } from './update-event-approval.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';
import type { EventApprovalModel } from '../../../../factories/domains/events/event-approval.model';

@CommandHandler(UpdateEventApprovalCommand)
export class UpdateEventApprovalHandler implements ICommandHandler<UpdateEventApprovalCommand> {
  constructor(private readonly eventFactory: EventApprovalFactory) {}

  async execute(command: UpdateEventApprovalCommand): Promise<EventApprovalModel> {
    const { id, ...updateEventApproval } = command.updateEventApproval;
    // TODO: do stuff with supervisor ID/ refactor the whole update logic with an "ensureExist" find method
    return await this.eventFactory.update({ id, tenant: command.tenant }, command.populate, updateEventApproval, {});
  }
}
