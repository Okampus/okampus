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
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { BaseRepository } from '@common/lib/orm/base.repository';
// Import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { Tenant } from '@modules/org/tenants/tenant.entity';
// Import { EventApproval } from '@modules/plan/approvals/approval.entity';
import { EventApprovalsService } from '@modules/plan/approvals/approvals.service';
import { CreateEventApprovalDto } from '@modules/plan/approvals/dto/create-approval.dto';
import { CreateEventDto } from '@modules/plan/events/dto/create-event.dto';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import { User } from '@modules/uaa/users/user.entity';
import { ListEventsDto } from './dto/list-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';
import { EventsService } from './events.service';

@Resolver(() => Event)
export class EventsResolver {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventApprovalsService: EventApprovalsService,
    @InjectRepository(EventRegistration) private readonly eventRegistrationRepository:
      BaseRepository<EventRegistration>,
    // @InjectRepository(ApprovalStep) private readonly approvalStepRepository:
    //   BaseRepository<ApprovalStep>,
    // @InjectRepository(EventApproval) private readonly eventApprovalRepository:
    //   BaseRepository<EventApproval>,
  ) {}

  // TODO: Add permission checks
  @Query(() => Event)
  public async eventById(@CurrentUser() user: User, @Args('id', { type: () => Int }) id: number): Promise<Event> {
    return await this.eventsService.findOne(user, id);
  }

  @Query(() => [Event])
  public async events(@CurrentUser() user: User, @Args('filter') filter: ListEventsDto): Promise<Event[]> {
    const paginatedEvents = await this.eventsService.findAll(user, filter);
    return paginatedEvents.items;
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
