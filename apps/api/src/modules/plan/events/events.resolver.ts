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
import { CurrentTenant } from '@meta/shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { ValidationStep } from '@modules/org/tenants/validation-steps/validation-step.entity';
import { CreateTeamEventValidationDto } from '@modules/plan/event-validations/dto/create-team-event-validation.dto';
import { CreateTeamEventDto } from '@modules/plan/events/dto/create-team-event.dto';
import { User } from '@modules/uua/users/user.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { TeamEventValidationsService } from '../event-validations/event-validations.service';
import { TeamEventValidation } from '../event-validations/team-event-validation.entity';
import { ListTeamEventsDto } from './dto/list-team-events.dto';
import { UpdateTeamEventDto } from './dto/update-team-event.dto';
import { TeamEventsService } from './events.service';
import { TeamEvent } from './team-event.entity';

@Resolver(() => TeamEvent)
export class TeamEventsResolver {
  constructor(
    private readonly teamEventsService: TeamEventsService,
    private readonly eventValidationsService: TeamEventValidationsService,
    @InjectRepository(TeamEventRegistration) private readonly teamEventRegistrationRepository:
      BaseRepository<TeamEventRegistration>,
    @InjectRepository(ValidationStep) private readonly validationStepRepository:
      BaseRepository<ValidationStep>,
    @InjectRepository(TeamEventValidation) private readonly eventValidationRepository:
      BaseRepository<TeamEventValidation>,
  ) {}

  // TODO: Add permission checks
  @Query(() => TeamEvent)
  public async eventById(@CurrentUser() user: User, @Args('id', { type: () => Int }) id: number): Promise<TeamEvent> {
    return await this.teamEventsService.findOne(user, id);
  }

  @Query(() => [TeamEvent])
  public async events(@CurrentUser() user: User, @Args('filter') filter: ListTeamEventsDto): Promise<TeamEvent[]> {
    const paginatedEvents = await this.teamEventsService.findAll(user, filter);
    return paginatedEvents.items;
  }

  @Mutation(() => TeamEvent)
  public async createEvent(
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
    @Args('id', { type: () => Int }) id: number,
    @Args('createEvent') createEvent: CreateTeamEventDto,
  ): Promise<TeamEvent> {
    return await this.teamEventsService.create(tenant, user, id, createEvent);
  }

  @Mutation(() => TeamEvent)
  public async updateEvent(
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
    @Args('id', { type: () => Int }) id: number,
    @Args('updateEvent') updateEvent: UpdateTeamEventDto,
  ): Promise<TeamEvent> {
    return await this.teamEventsService.update(tenant, user, id, updateEvent);
  }

  @Mutation(() => TeamEvent)
  public async validateEvent(
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
    @Args('id', { type: () => Int }) id: number,
    @Args('createValidation') createValidation: CreateTeamEventValidationDto,
  ): Promise<TeamEvent> {
    await this.eventValidationsService.create(tenant, user, id, createValidation);
    return await this.teamEventsService.findOne(user, id);
  }

  @ResolveField(() => TeamEventRegistration, { nullable: true })
  public async userRegistration(
    @CurrentUser() user: User,
    @Parent() event: TeamEvent,
  ): Promise<TeamEventRegistration | null> {
    return await this.teamEventRegistrationRepository.findOne({ user, event });
  }
}
