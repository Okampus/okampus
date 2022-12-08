import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import type { ListOptionsDto } from '@common/lib/dto/list-options.dto';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { ApprovalStepType } from '@common/lib/types/enums/approval-step-type.enum';
import { EventState } from '@common/lib/types/enums/event-state.enum';
import { Role } from '@common/modules/authorization/types/role.enum';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';
import {
  AdminEventValidationStartedNotification,
  EventCreatedNotification,
  EventSubscribedUpdatedNotification,
  TeamManagedEventUpdatedNotification,
  TeamSubscribedEventCreatedNotification,
} from '@common/modules/notifications/notifications';
import { NotificationsService } from '@common/modules/notifications/notifications.service';
import type { PaginatedNodes } from '@common/modules/pagination';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { Team } from '@modules/org/teams/team.entity';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import type { CreateEventDto } from '@modules/plan/events/dto/create-event.dto';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import type { User } from '@modules/uaa/users/user.entity';
import type { ListEventsDto } from './dto/list-events.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: BaseRepository<EventRegistration>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(ApprovalStep) private readonly approvalStepRepository: BaseRepository<ApprovalStep>,

    private readonly notificationsService: NotificationsService,
  ) {}

  public async create(
    tenant: Tenant,
    user: User,
    id: number,
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    const team = await this.teamRepository.findOneOrFail({ id }, { populate: ['members'] });

    if (!team.canManage(user))
      throw new ForbiddenException('Not a team manager');

    // Check that the provided supervisor id is valid
    let supervisor: TeamMember | undefined;
    if (createEventDto.supervisorId) {
      supervisor = await this.teamMemberRepository.findOneOrFail(
        {
          user: { id: createEventDto.supervisorId },
          active: true,
        },
        { populate: ['user'] },
      );
    }

    // Check that the provided form id is valid, is a template, and is not already used
    let registrationForm: TeamForm | undefined;
    if (createEventDto.formId) {
      registrationForm = await this.teamFormRepository.findOneOrFail({ id: createEventDto.formId, team });
      if (registrationForm.isTemplate)
        throw new BadRequestException('Form is a template');

      const isAlreadyUsed = await this.eventRepository.findOne({ registrationForm });
      if (isAlreadyUsed)
        throw new BadRequestException('Form is already used');
    }

    // Check that the provided event template id is valid and is a template
    let usedTemplate: Event | undefined;
    if (createEventDto.templateId && createEventDto.state !== EventState.Template) {
      usedTemplate = await this.eventRepository.findOneOrFail({ id: createEventDto.templateId, team });
      if (usedTemplate.state !== EventState.Template)
        throw new BadRequestException('Template is not a template');
    }

    let approvalStepCount = 0;
    if (createEventDto.state === EventState.Submitted) {
      approvalStepCount = await this.approvalStepRepository.count({
        tenant,
        type: ApprovalStepType.Event,
      });

      if (approvalStepCount === 0)
        createEventDto.state = EventState.Published;
    }

    const event = new Event({
      ...createEventDto,
      supervisor,
      usedTemplate,
      team,
      registrationForm,
      createdBy: user,
    });

    await this.eventRepository.persistAndFlush(event);

    if (createEventDto.state === EventState.Submitted && approvalStepCount > 0) {
      void this.notificationsService.trigger(
        new AdminEventValidationStartedNotification(event, { executor: user }),
      );
    }
    void this.notificationsService.trigger(new TeamManagedEventUpdatedNotification(event, { executor: user }));

    return event;
  }

  public async findAll(
    user: User,
    query: ListEventsDto,
    options?: Required<ListOptionsDto>,
  ): Promise<PaginatedNodes<Event>> {
    const memberships = await this.teamMemberRepository.find({ user });
    const ids = memberships.map(m => m.team.id);

    let filter: FilterQuery<Event> = {};
    if (query.id && !ids.includes(query.id)) {
      // We asked for the events of a team that the user is not a member of
      // so we only search for public & published events
      filter = {
        team: { id: query.id },
        private: false,
        state: EventState.Published,
      };
    } else if (query.id) {
      // We asked for the events of a team that the user is a member of
      // so we search for all events, private or not.
      filter = {
        team: { id: query.id },
        ...(query.state ? { state: query.state } : {}),
      };
    } else if (user.scopeRole === ScopeRole.Admin || user.roles.includes(Role.TenantAdmin)) {
      filter = query.state ? { state: query.state } : {};
    } else {
      // We asked for all the events of all teams
      // so we search for the public & private events of the teams the user is a member of
      // and the public & published events of the teams the user is not a member of
      filter = {
        $or: [
          { team: { $in: ids }, state: query.state ?? EventState.Published },
          { team: { $nin: ids }, private: false, state: EventState.Published },
        ],
      };
    }

    if (typeof query.priceBelow !== 'undefined')
      filter = { ...filter, price: { $lte: query.priceBelow } };
    if (query.before)
      filter = { ...filter, start: { $lte: query.before } };
    if (query.after)
      filter = { ...filter, start: { $gte: query.after } };

    const events = await this.eventRepository.findWithPagination(
      options,
      filter,
      {
        // FIXME: Enable orderBy with pagination
        // orderBy: serializeOrder(options?.sortBy, 'start'),
        populate: ['supervisor', 'registrations', 'registrations.user', 'createdBy', 'team', 'lastApprovalStep'],
      },
    );

    const allRegistrations = await this.eventRegistrationRepository.find({ user });

    events.edges = events.edges.map((event) => {
      // TODO: Maybe find a better way to add these properties? Something virtual? computed on-the-fly? added elsewhere?
      // @ts-expect-error: We add a new property to the object, but it's fine.
      event.isRegistered = allRegistrations.some(r => r.event.id === event.id);
      return event;
    });

    return events;
  }

  public async findOne(user: User, id: number): Promise<Event> {
    const memberships = await this.teamMemberRepository.find({ user });
    const ids = memberships.map(m => m.team.id);

    if (user.roles.includes(Role.TenantAdmin) || user.scopeRole === ScopeRole.Admin)
      return await this.eventRepository.findOneOrFail({ id }, { populate: ['supervisor', 'registrations', 'registrations.user', 'createdBy', 'team', 'lastApprovalStep'] });


    const event = await this.eventRepository.findOneOrFail(
      {
        id,
        $or: [
          { team: { $in: ids } },
          { private: false, state: EventState.Published },
        ],
      },
      { populate: ['supervisor', 'createdBy', 'team', 'team.members', 'registrations', 'registrations.user', 'registrationForm', 'usedTemplate', 'lastApprovalStep'] },
    );
    if (event.state === EventState.Draft && !event.canEdit(user))
      throw new ForbiddenException('Event not published');

    return event;
  }

  public async update(
    tenant: Tenant,
    user: User,
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventRepository.findOneOrFail({ id }, { populate: ['team', 'team.members', 'lastApprovalStep'] });

    if (!event.canEdit(user))
      throw new ForbiddenException('Not allowed to edit event');

    if (event.state === EventState.Template && 'state' in updateEventDto)
      throw new BadRequestException('Cannot change state of a template');

    const { supervisorId, ...dto } = updateEventDto;

    // Check that the provided supervisor id is valid
    if (typeof supervisorId !== 'undefined') {
      const supervisorMembership = await this.teamMemberRepository.findOneOrFail(
        {
          user: { id: supervisorId },
          active: true,
        },
        { populate: ['user'] },
      );
      event.supervisor = supervisorMembership;
    }

    // Check that the provided form id is valid, is a template, and is not already used
    let registrationForm: TeamForm | undefined;
    if (dto.formId) {
      registrationForm = await this.teamFormRepository.findOneOrFail({ id: dto.formId, team: event.team });
      if (registrationForm.isTemplate)
        throw new BadRequestException('Form is a template');

      const isAlreadyUsed = await this.eventRepository.findOne({ registrationForm });
      if (isAlreadyUsed)
        throw new BadRequestException('Form is already used');
    }

    let approvalStepCount = 0;
    if (dto.state === EventState.Submitted) {
      approvalStepCount = await this.approvalStepRepository.count({
        tenant,
        type: ApprovalStepType.Event,
      });
      if (approvalStepCount === 0)
        dto.state = EventState.Published;
    }

    if (event.state !== EventState.Submitted && dto.state === EventState.Submitted && approvalStepCount > 0) {
      void this.notificationsService.trigger(
        new AdminEventValidationStartedNotification(event, { executor: user }),
      );
    } else if (event.state !== EventState.Published && dto.state === EventState.Published) {
      void this.notificationsService.triggerFirst(
        new TeamManagedEventUpdatedNotification(event, { executor: user }),
        new TeamSubscribedEventCreatedNotification(event, { executor: user }),
        new EventCreatedNotification(event, { executor: user }),
      );
    } else if (event.state === EventState.Published) {
      void this.notificationsService.triggerFirst(
        new TeamManagedEventUpdatedNotification(event, { executor: user }),
        new EventSubscribedUpdatedNotification(event, { executor: user }),
      );
    } else {
      void this.notificationsService.trigger(new TeamManagedEventUpdatedNotification(event, { executor: user }));
    }

    wrap(event).assign({ ...dto, registrationForm });
    await this.eventRepository.flush();

    return event;
  }

  public async remove(user: User, id: number): Promise<void> {
    const event = await this.eventRepository.findOneOrFail({ id }, { populate: ['team', 'team.members'] });
    if (!event.canEdit(user))
      throw new ForbiddenException('Not allowed to edit event');

    void this.notificationsService.triggerFirst(
      new TeamManagedEventUpdatedNotification(event, { executor: user }),
      new EventSubscribedUpdatedNotification(event, { executor: user }),
    );

    await this.eventRepository.removeAndFlush(event);
  }
}
