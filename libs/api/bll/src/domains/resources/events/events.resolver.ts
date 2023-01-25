import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from '@okampus/shared/dtos';
import { PaginatedTenantEventModel, TenantEventModel } from '../../factories/events/event.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { UUID } from '@okampus/shared/types';

@Resolver(() => TenantEventModel)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => TenantEventModel)
  eventById(@Args('id', { type: () => String }) id: UUID) {
    return this.eventsService.findOneById(id);
  }

  @Query(() => PaginatedTenantEventModel)
  events(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.eventsService.find(options);
  }

  @Mutation(() => TenantEventModel)
  createEvent(@Args('event') event: CreateEventDto) {
    return this.eventsService.create(event);
  }

  @Mutation(() => TenantEventModel)
  updateEvent(@Args('updateEvent') updateEvent: UpdateEventDto) {
    return this.eventsService.update(updateEvent);
  }

  @Mutation(() => Boolean)
  deleteEvent(@Args('id', { type: () => String }) id: UUID) {
    return this.eventsService.delete(id);
  }
}
