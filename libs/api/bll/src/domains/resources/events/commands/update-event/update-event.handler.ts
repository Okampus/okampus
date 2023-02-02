import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantEventFactory } from '../../../../factories/domains/events/event.factory';
import { TenantEventModel } from '../../../../factories/domains/events/event.model';
import { UpdateEventCommand } from './update-event.command';

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(command: UpdateEventCommand): Promise<TenantEventModel> {
    const { id, ...updateEvent } = command.updateEvent;
    // TODO: do stuff with supervisor ID/ refactor the whole update logic with an "ensureExist" find method
    return await this.eventFactory.update({ id, tenant: command.tenant }, command.populate, updateEvent, {});
  }
}
