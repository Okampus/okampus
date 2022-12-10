import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentTenant } from '@lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { BaseRepository } from '@lib/orm/base.repository';
import { EventApprovalsService } from '@plan/approvals/approvals.service';
import { CreateEventApprovalDto } from '@plan/approvals/dto/create-approval.dto';
import { CreateEventDto } from '@plan/events/dto/create-event.dto';
import { EventRegistration } from '@plan/registrations/registration.entity';
import { Tenant } from '@tenants/tenant.entity';
import { User } from '@uaa/users/user.entity';
import { ListEventsDto } from './dto/list-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, PaginatedEvent } from './event.entity';
import { EventsService } from './events.service';

@Resolver(() => Event)
export class EventsResolver {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventApprovalsService: EventApprovalsService,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: BaseRepository<EventRegistration>,
  ) {}

  // TODO: Add permission checks
  @Query(() => Event)
  public async eventById(@CurrentUser() user: User, @Args('id', { type: () => Int }) id: number): Promise<Event> {
    return await this.eventsService.findOne(user, id);
  }

  @Query(() => PaginatedEvent)
  public async events(@CurrentUser() user: User, @Args('filter') filter: ListEventsDto): Promise<PaginatedEvent> {
    return await this.eventsService.findAll(user, filter);
  }

  @Mutation(() => Event)
  public async createEvent(
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
    @Args('id', { type: () => Int }) id: number,
    @Args('createEvent') createEvent: CreateEventDto,
  ): Promise<Event> {
    return await this.eventsService.create(tenant, user, id, createEvent);
  }

  @Mutation(() => Event)
  public async updateEvent(
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
    @Args('id', { type: () => Int }) id: number,
    @Args('updateEvent') updateEvent: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventsService.update(tenant, user, id, updateEvent);
  }

  @Mutation(() => Event)
  public async validateEvent(
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
    @Args('id', { type: () => Int }) id: number,
    @Args('createApproval') createApproval: CreateEventApprovalDto,
  ): Promise<Event> {
    await this.eventApprovalsService.create(tenant, user, id, createApproval);
    return await this.eventsService.findOne(user, id);
  }

  @ResolveField(() => EventRegistration, { nullable: true })
  public async userRegistration(
    @CurrentUser() user: User,
    @Parent() event: Event,
  ): Promise<EventRegistration | null> {
    return await this.eventRegistrationRepository.findOne({ user, event });
  }
}
