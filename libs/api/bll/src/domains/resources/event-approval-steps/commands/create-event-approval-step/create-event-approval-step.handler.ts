import { CreateEventApprovalStepCommand } from './create-event-approval-step.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TenantCore } from '@okampus/api/dal';
import type { EventApprovalStepModel } from '../../../../factories/domains/events/event-approval-step.model';

@CommandHandler(CreateEventApprovalStepCommand)
export class CreateEventApprovalStepHandler implements ICommandHandler<CreateEventApprovalStepCommand> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(command: CreateEventApprovalStepCommand): Promise<EventApprovalStepModel> {
    return await this.eventApprovalStepFactory.createEventApprovalStep(
      command.createEventApprovalStep,
      { id: command.tenant.id } as TenantCore,
      command.requester
    );
  }
}
