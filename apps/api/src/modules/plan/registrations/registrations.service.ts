import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { EventRegisterStatus } from '@common/lib/types/enums/event-register-status.enum';
import { Role } from '@common/modules/authorization/types/role.enum';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import type { CreateEventRegistrationDto } from '@modules/plan/registrations/dto/create-event-registration.dto';
import type { User } from '@modules/uua/users/user.entity';
import { Event } from '../events/event.entity';
import type { ListRegisteredEventsDto } from './dto/list-registered-events.dto';
import type { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { EventRegistration } from './registration.entity';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: BaseRepository<EventRegistration>,
  ) {}

  public async create(
    user: User,
    id: number,
    createEventRegistrationDto: CreateEventRegistrationDto,
  ): Promise<EventRegistration> {
    const event = await this.eventRepository.findOneOrFail(
      { id },
      { populate: ['createdBy', 'team'] },
    );

    // Check that the user is a member of the team if the event is private
    if (event.private) {
      const membership = await this.teamMemberRepository.findOne({ user, team: { id: event.team.id } });
      if (!membership)
        throw new ForbiddenException('Not a team member');
    }

    // Check that the user is not already registered for the event
    const existing = await this.eventRegistrationRepository.findOne({ user, event: { id } });
    if (existing && existing.status === EventRegisterStatus.Absent) {
      existing.status = createEventRegistrationDto.status;
      await this.eventRegistrationRepository.flush();
      return existing;
    } else if (existing) {
      throw new BadRequestException('Already registered');
    }

    // 4. Check that the form is valid
    const formFields = await this.getAndValidateFormSubmission(
      event.registrationForm,
      createEventRegistrationDto.originalFormId,
      createEventRegistrationDto.formSubmission,
    );

    // Create the registration
    const registration = new EventRegistration({
      ...createEventRegistrationDto,
      ...formFields,
      user,
      event,
    });

    await this.eventRegistrationRepository.persistAndFlush(registration);
    return registration;
  }

  public async findAll(
    user: User,
    query: ListRegisteredEventsDto,
    options?: Required<PaginateDto>,
  ): Promise<PaginatedResult<EventRegistration>> {
    let filter: FilterQuery<EventRegistration> = {};

    /**
     *   VISIBILITY OF REGISTRATIONS DEPENDING ON THE REQUESTER'S ROLE
     *
     *                                        +---------------------+---------------+
     *                                        |       Student       | Administrator |
     *   +------------------------------------+---------------------+---------------+
     *   | All registrations of a given event | Yes, if event-admin |      Yes      |
     *   +------------------------------------+---------------------+---------------+
     *   | All registrations of a given user  |    Only for self    |    Anyone     |
     *   +------------------------------------+---------------------+---------------+
     */

    if (query.eventId) {
      // TODO: fix permissions here
      // const event = await this.eventRepository.findOneOrFail(
      //   { id: query.id },
      //   { populate: ['team', 'team.members'] });
      // if (!event.canEdit(user))
      //   throw new ForbiddenException('Cannot view registrations');
      filter = { ...filter, event: { id: query.eventId } };
    } else if (query.userId && [Role.Moderator, Role.ClubManager, Role.Admin].some(role => user.roles.includes(role))) {
      filter = { ...filter, user: { id: query.userId } };
    } else {
      filter = { ...filter, user };
    }

    if (typeof query.present === 'boolean')
      filter = { ...filter, present: query.present };

    return await this.eventRegistrationRepository.findWithPagination(
      options,
      filter,
      { orderBy: { createdAt: 'ASC' }, populate: ['user', 'event', 'event.team'] },
    );
  }

  public async findOne(user: User, id: number): Promise<EventRegistration> {
    const registration = await this.eventRegistrationRepository.findOneOrFail(
      { id },
      { populate: ['user', 'event', 'event.team'] },
    );

    if (registration.event.private) {
      const membership = await this.teamMemberRepository.findOne({
        user,
        team: { id: registration.event.team.id },
      });
      if (!membership)
        throw new ForbiddenException('Not a team member');
    }

    return registration;
  }

  public async update(
    user: User,
    id: number,
    updateEventRegistrationDto: UpdateEventRegistrationDto,
  ): Promise<EventRegistration> {
    const registration = await this.eventRegistrationRepository.findOneOrFail(
      { id },
      { populate: ['user', 'event', 'event.team', 'event.team.members'] },
    );

    if ('present' in updateEventRegistrationDto || 'participationScore' in updateEventRegistrationDto) {
      if (!registration.event.canEdit(user))
        throw new ForbiddenException('Not a team admin');
      if (registration.event.start.getTime() > Date.now())
        throw new BadRequestException('Event not started');
    }

    const member = await this.teamMemberRepository.findOneOrFail({ user: registration.user.id });
    if (!registration.present && updateEventRegistrationDto.present)
      member.participations += 1;
    else if (registration.present && updateEventRegistrationDto.present === false)
      member.participations -= 1;

    if (updateEventRegistrationDto.participationScore)
      member.participationScore += updateEventRegistrationDto.participationScore - registration.participationScore;

    wrap(registration).assign(updateEventRegistrationDto);
    await this.eventRegistrationRepository.flush();
    await this.teamMemberRepository.persistAndFlush(member);

    return registration;
  }

  public async remove(user: User, id: number): Promise<void> {
    const registration = await this.eventRegistrationRepository.findOneOrFail(
      { id },
      { populate: ['event.team', 'event.team.members'] },
    );

    if (!registration.event.canEdit(user) && registration.user.id !== user.id)
      throw new ForbiddenException('Cannot unregister');

    const member = await this.teamMemberRepository.findOneOrFail({ user: registration.user.id });
    if (registration.present)
      member.participations -= 1;
    member.participationScore -= registration.participationScore;

    await this.eventRegistrationRepository.removeAndFlush(registration);
    await this.teamMemberRepository.flush();
  }

  private async getAndValidateFormSubmission(
    teamForm?: TeamForm | null,
    askedFormId?: number | null,
    formSubmission?: object[] | object | null,
  ): Promise<{ formSubmission?: object[] | object | null; originalForm?: TeamForm | null }> {
    // If the default form was used, we don't need to validate it
    // TODO: formalize default forms (shared in monorepo) for validation
    if (formSubmission && !teamForm && !askedFormId)
      return { formSubmission, originalForm: null };


    if (teamForm && askedFormId && formSubmission) {
      if (askedFormId !== teamForm.id)
        throw new BadRequestException('Wrong form');

      const form = await this.teamFormRepository.findOneOrFail({ id: askedFormId });
      if (form.isTemplate)
        throw new BadRequestException('Form is a template');

      return { formSubmission, originalForm: form };
    }

    // We cannot update the form submission / original form individually and even less if there is a required form
    if (teamForm || askedFormId || formSubmission)
      throw new BadRequestException('Invalid form entries');

    // Either one of form submission / original form are all null, so we set them all to null
    return { formSubmission: null, originalForm: null };
  }
}
