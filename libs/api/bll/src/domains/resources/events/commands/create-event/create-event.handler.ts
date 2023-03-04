import { CreateEventCommand } from './create-event.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantEventFactory } from '../../../../factories/domains/events/event.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TenantEventModel } from '../../../../factories/domains/events/event.model';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(command: CreateEventCommand): Promise<TenantEventModel> {
    return await this.eventFactory.createEvent(command.createEvent, command.tenant, command.requester);
  }
}
