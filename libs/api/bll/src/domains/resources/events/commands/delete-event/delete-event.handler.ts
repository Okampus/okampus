import { DeleteEventCommand } from './delete-event.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantEventFactory } from '../../../../factories/domains/events/event.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteEventCommand)
export class DeleteEventHandler implements ICommandHandler<DeleteEventCommand> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(command: DeleteEventCommand): Promise<boolean> {
    return await this.eventFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
