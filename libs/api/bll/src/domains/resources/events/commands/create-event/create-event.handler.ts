import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { TenantEventFactory } from '../../../../factories/domains/events/event.factory';
import type { TenantEventModel } from '../../../../factories/domains/events/event.model';
import { CreateEventCommand } from './create-event.command';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(command: CreateEventCommand): Promise<TenantEventModel> {
    return await this.eventFactory.createEvent(command.createEvent, command.forTenant, command.forIndividual);
  }
}
