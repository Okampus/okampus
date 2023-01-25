import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventApprovalStepFactory } from '../../../../factories/events/event-approval-step.factory';
import { EventApprovalStepModel } from '../../../../factories/events/event-approval-step.model';
import { UpdateEventApprovalStepCommand } from './update-event-approval-step.command';

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
