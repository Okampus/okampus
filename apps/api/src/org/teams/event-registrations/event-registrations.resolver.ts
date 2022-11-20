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
import { APP_PUB_SUB } from '../../../shared/lib/constants';
import { CurrentUser } from '../../../shared/lib/decorators/current-user.decorator';
import { SubscriptionType } from '../../../shared/lib/types/enums/subscription-type.enum';
import { User } from '../../../uua/users/user.entity';
import { TeamEventsService } from '../events/events.service';
import { TeamEvent } from '../events/team-event.entity';
import { CreateTeamEventRegistrationDto } from './dto/create-team-event-registration.dto';
import { FilterRegisteredEventsDto } from './dto/list-registered-events.dto';
import { UpdateTeamEventRegistrationDto } from './dto/update-team-event-registration.dto';
import { TeamEventRegistrationsService } from './event-registrations.service';
import { TeamEventRegistration } from './team-event-registration.entity';

@Resolver(() => TeamEventRegistration)
export class TeamEventRegistrationsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly teamEventsService: TeamEventsService,
    private readonly teamEventRegistrationsService: TeamEventRegistrationsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => TeamEventRegistration, { nullable: true })
  public async teamEventRegistrationById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TeamEventRegistration> {
    return await this.teamEventRegistrationsService.findOne(user, id);
  }

  @Query(() => [TeamEventRegistration])
  public async teamEventRegistrations(
    @CurrentUser() user: User,
    @Args('filters') filters: FilterRegisteredEventsDto,
  ): Promise<TeamEventRegistration[]> {
    const paginatedTeams = await this.teamEventRegistrationsService.findAll(user, filters);
    return paginatedTeams.items;
  }

  @Mutation(() => TeamEvent)
  public async addTeamEventRegistration(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('registration') registration: CreateTeamEventRegistrationDto,
  ): Promise<TeamEvent> {
    const createdRegistration = await this.teamEventRegistrationsService.create(user, id, registration);
    await this.pubSub.publish(SubscriptionType.TeamEventRegistrationAdded, {
      teamEventRegistrationAdded: createdRegistration,
    });
    return await this.teamEventsService.findOne(user, id);
  }

  @Mutation(() => TeamEventRegistration)
  public async updateTeamEventRegistration(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('registration') registration: UpdateTeamEventRegistrationDto,
  ): Promise<TeamEventRegistration> {
    const updatedRegistration = await this.teamEventRegistrationsService.update(user, id, registration);
    await this.pubSub.publish(SubscriptionType.TeamEventRegistrationUpdated, {
      teamEventRegistrationUpdated: updatedRegistration,
    });
    return updatedRegistration;
  }

  @Subscription(() => TeamEventRegistration)
  public teamEventRegistrationAdded(): AsyncIterator<TeamEventRegistration> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamEventRegistrationAdded);
  }

  @Subscription(() => TeamEventRegistration)
  public teamEventRegistrationUpdated(): AsyncIterator<TeamEventRegistration> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamEventRegistrationUpdated);
  }
}
