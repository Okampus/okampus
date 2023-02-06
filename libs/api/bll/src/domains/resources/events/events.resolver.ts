// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventsService } from './events.service';

import { PaginatedTenantEventModel, TenantEventModel } from '../../factories/domains/events/event.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateEventDto, UpdateEventDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';

@Resolver(() => TenantEventModel)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => TenantEventModel)
  eventById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventsService.findOneById(id);
  }

  @Query(() => PaginatedTenantEventModel)
  events(@Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions) {
    return this.eventsService.find(options);
  }

  @Mutation(() => TenantEventModel)
  createEvent(@Args('event', { type: () => CreateEventDto }) event: CreateEventDto) {
    return this.eventsService.create(event);
  }

  @Mutation(() => TenantEventModel)
  updateEvent(@Args('updateEvent', { type: () => UpdateEventDto }) updateEvent: UpdateEventDto) {
    return this.eventsService.update(updateEvent);
  }

  @Mutation(() => Boolean)
  deleteEvent(@Args('id', { type: () => String }) id: Snowflake) {
    return this.eventsService.delete(id);
  }
}
