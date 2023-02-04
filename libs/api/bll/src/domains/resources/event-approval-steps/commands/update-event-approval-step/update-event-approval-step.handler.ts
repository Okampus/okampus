import { UpdateEventApprovalStepCommand } from './update-event-approval-step.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { EventApprovalStepFactory } from '../../../../factories/domains/events/event-approval-step.factory';
import type { EventApprovalStepModel } from '../../../../factories/domains/events/event-approval-step.model';

@CommandHandler(UpdateEventApprovalStepCommand)
export class UpdateEventApprovalStepHandler implements ICommandHandler<UpdateEventApprovalStepCommand> {
  constructor(private readonly eventApprovalStepFactory: EventApprovalStepFactory) {}

  async execute(command: UpdateEventApprovalStepCommand): Promise<EventApprovalStepModel> {
    const { id, ...updateEventApprovalStep } = command.updateEventApprovalStep;
    // TODO: do stuff with supervisor ID/ refactor the whole update logic with an "ensureExist" find method
    return await this.eventApprovalStepFactory.update(
      { id, tenant: command.tenant },
      command.populate,
      updateEventApprovalStep,
      {}
    );
  }
}
