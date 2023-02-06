import { CreateEventCommand } from './commands/create-event/create-event.command';
import { DeleteEventCommand } from './commands/delete-event/delete-event.command';
import { UpdateEventCommand } from './commands/update-event/update-event.command';
import { GetEventByIdQuery } from './queries/get-event-by-id/get-event-by-id.query';
import { GetEventsQuery } from './queries/get-events/get-events.query';
import { RequestContext } from '../../../shards/request-context/request-context';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateEventDto, UpdateEventDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { TenantEventModel, PaginatedTenantEventModel } from '../../factories/domains/events/event.model';

const defaultEventPopulate = ['actor', 'actor.images', 'actor.socials'];

@Injectable()
export class EventsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<TenantEventModel> {
    const query = new GetEventByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultEventPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedTenantEventModel> {
    const query = new GetEventsQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultEventPopulate));
    return this.queryBus.execute(query);
  }

  create(createEvent: CreateEventDto): Promise<TenantEventModel> {
    const command = new CreateEventCommand(createEvent, this.tenant(), this.requester());
    return this.commandBus.execute(command);
  }

  update(updateEvent: UpdateEventDto): Promise<TenantEventModel> {
    const command = new UpdateEventCommand(updateEvent, this.tenant(), this.autoGqlPopulate(defaultEventPopulate));
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteEventCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
