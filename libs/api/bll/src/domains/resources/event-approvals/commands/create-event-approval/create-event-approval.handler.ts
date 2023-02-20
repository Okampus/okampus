import { CreateEventApprovalCommand } from './create-event-approval.command';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalFactory } from '../../../../factories/domains/events/event-approval.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { CommandHandler } from '@nestjs/cqrs';
import { TenantCore } from '@okampus/api/dal';

import type { ICommandHandler } from '@nestjs/cqrs';
import type { EventApprovalModel } from '../../../../factories/domains/events/event-approval.model';

@CommandHandler(CreateEventApprovalCommand)
export class CreateEventApprovalHandler implements ICommandHandler<CreateEventApprovalCommand> {
  constructor(private readonly em: EntityManager, private readonly eventApprovalFactory: EventApprovalFactory) {}

  async execute(command: CreateEventApprovalCommand): Promise<EventApprovalModel> {
    return await this.eventApprovalFactory.createEventApproval(
      command.createEventApproval,
      this.em.getReference(TenantCore, command.tenant.id),
      command.requester
    );
  }
}
