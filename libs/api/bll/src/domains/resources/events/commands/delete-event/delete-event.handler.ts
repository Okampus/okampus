import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantEventFactory } from '../../../../factories/events/event.factory';
import { DeleteEventCommand } from './delete-event.command';

@CommandHandler(DeleteEventCommand)
export class DeleteEventHandler implements ICommandHandler<DeleteEventCommand> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(command: DeleteEventCommand): Promise<boolean> {
    return await this.eventFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
