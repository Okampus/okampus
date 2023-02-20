import { CreateEventApprovalStepCommand } from './create-event-approval-step.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { CommandHandler } from '@nestjs/cqrs';
import { TenantCore } from '@okampus/api/dal';

import type { ICommandHandler } from '@nestjs/cqrs';
import type { EventApprovalStepModel } from '../../../../factories/domains/events/event-approval-step.model';

@CommandHandler(CreateEventApprovalStepCommand)
export class CreateEventApprovalStepHandler implements ICommandHandler<CreateEventApprovalStepCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly eventApprovalStepFactory: EventApprovalStepFactory
  ) {}

  async execute(command: CreateEventApprovalStepCommand): Promise<EventApprovalStepModel> {
    return await this.eventApprovalStepFactory.createEventApprovalStep(
      command.createEventApprovalStep,
      this.em.getReference(TenantCore, command.tenant.id),
      command.requester
    );
  }
}
