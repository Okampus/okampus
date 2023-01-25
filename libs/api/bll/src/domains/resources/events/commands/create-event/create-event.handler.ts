import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantEventFactory } from '../../../../factories/events/event.factory';
import { TenantEventModel } from '../../../../factories/events/event.model';
import { CreateEventCommand } from './create-event.command';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(command: CreateEventCommand): Promise<TenantEventModel> {
    return await this.eventFactory.createEvent(command.createEvent, command.forTenant, command.forIndividual);
  }
}
