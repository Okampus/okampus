import { DeleteEventCommand } from './delete-event.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TenantEventFactory } from '../../../../factories/domains/events/event.factory';

@CommandHandler(DeleteEventCommand)
export class DeleteEventHandler implements ICommandHandler<DeleteEventCommand> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(command: DeleteEventCommand): Promise<boolean> {
    return await this.eventFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
