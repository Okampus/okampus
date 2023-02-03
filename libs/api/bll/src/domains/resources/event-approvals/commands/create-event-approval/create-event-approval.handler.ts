import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantCore } from '@okampus/api/dal';
import { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';
import { EventApprovalModel } from '../../../../factories/domains/events/event-approval.model';
import { CreateEventApprovalCommand } from './create-event-approval.command';

@CommandHandler(CreateEventApprovalCommand)
export class CreateEventApprovalHandler implements ICommandHandler<CreateEventApprovalCommand> {
  constructor(private readonly eventApprovalFactory: EventApprovalFactory) {}

  async execute(command: CreateEventApprovalCommand): Promise<EventApprovalModel> {
    return await this.eventApprovalFactory.createEventApproval(
      command.createEventApproval,
      { id: command.tenant.id } as TenantCore,
      command.requester
    );
  }
}