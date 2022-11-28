import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '@common/lib/constants';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { SubscriptionType } from '@common/lib/types/enums/subscription-type.enum';
import { CreateEventRegistrationDto } from '@modules/plan/registrations/dto/create-event-registration.dto';
import { User } from '@modules/uaa/users/user.entity';
import { Event } from '../events/event.entity';
import { EventsService } from '../events/events.service';
import { FilterRegisteredEventsDto } from './dto/list-registered-events.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { EventRegistration } from './registration.entity';
import { EventRegistrationsService } from './registrations.service';

@Resolver(() => EventRegistration)
export class EventRegistrationsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly eventsService: EventsService,
    private readonly eventRegistrationsService: EventRegistrationsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => EventRegistration, { nullable: true })
  public async eventRegistrationById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EventRegistration> {
    return await this.eventRegistrationsService.findOne(user, id);
  }

  @Query(() => [EventRegistration])
  public async eventRegistrations(
    @CurrentUser() user: User,
    @Args('filters') filters: FilterRegisteredEventsDto,
  ): Promise<EventRegistration[]> {
    const paginatedTeams = await this.eventRegistrationsService.findAll(user, filters);
    return paginatedTeams.items;
  }

  @Mutation(() => Event)
  public async addEventRegistration(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('registration') registration: CreateEventRegistrationDto,
  ): Promise<Event> {
    const createdRegistration = await this.eventRegistrationsService.create(user, id, registration);
    await this.pubSub.publish(SubscriptionType.EventRegistrationAdded, {
      eventRegistrationAdded: createdRegistration,
    });
    return await this.eventsService.findOne(user, id);
  }

  @Mutation(() => EventRegistration)
  public async updateEventRegistration(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('registration') registration: UpdateEventRegistrationDto,
  ): Promise<EventRegistration> {
    const updatedRegistration = await this.eventRegistrationsService.update(user, id, registration);
    await this.pubSub.publish(SubscriptionType.EventRegistrationUpdated, {
      eventRegistrationUpdated: updatedRegistration,
    });
    return updatedRegistration;
  }

  @Subscription(() => EventRegistration)
  public eventRegistrationAdded(): AsyncIterator<EventRegistration> {
    return this.pubSub.asyncIterator(SubscriptionType.EventRegistrationAdded);
  }

  @Subscription(() => EventRegistration)
  public eventRegistrationUpdated(): AsyncIterator<EventRegistration> {
    return this.pubSub.asyncIterator(SubscriptionType.EventRegistrationUpdated);
  }
}
