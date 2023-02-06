import { CreateEventApprovalCommand } from './create-event-approval.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TenantCore } from '@okampus/api/dal';
import type { EventApprovalModel } from '../../../../factories/domains/events/event-approval.model';

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
