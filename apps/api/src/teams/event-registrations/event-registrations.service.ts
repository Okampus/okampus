import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { Role } from '../../shared/modules/authorization/types/role.enum';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';
import type { CreateTeamEventRegistrationDto } from './dto/create-team-event-registration.dto';
import type { ListRegisteredEventsDto } from './dto/list-registered-events.dto';
import { TeamEventRegistration } from './team-event-registration.entity';

@Injectable()
export class TeamEventRegistrationsService {
  constructor(
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(TeamEventRegistration)
    private readonly teamEventRegistrationRepository: BaseRepository<TeamEventRegistration>,
  ) {}

  public async create(
    user: User,
    teamEventId: number,
    createTeamEventRegistrationDto: CreateTeamEventRegistrationDto,
  ): Promise<TeamEventRegistration> {
    const event = await this.teamEventRepository.findOneOrFail(
      { teamEventId },
      { populate: ['createdBy', 'team'] },
    );

    // Check that the user is a member of the team if the event is private
    if (event.private) {
      const membership = await this.teamMemberRepository.findOne({ user, team: { teamId: event.team.teamId } });
      if (!membership)
        throw new ForbiddenException('Not a team member');
    }

    // Check that the user is not already registered for the event
    const existing = await this.teamEventRegistrationRepository.count({ user, event: { teamEventId } });
    if (existing)
      throw new BadRequestException('Already registered');

    // 4. Check that the form is valid
    const formFields = await this.getAndValidateFormSubmission(
      event.form,
      createTeamEventRegistrationDto.originalFormId,
      createTeamEventRegistrationDto.formSubmission,
    );

    // Create the registration
    const registration = new TeamEventRegistration({
      ...createTeamEventRegistrationDto,
      ...formFields,
      user,
      event,
    });

    await this.teamEventRegistrationRepository.persistAndFlush(registration);
    return registration;
  }

  public async findAll(
    user: User,
    query: ListRegisteredEventsDto,
    options?: Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamEventRegistration>> {
    let filter: FilterQuery<TeamEventRegistration> = {};

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
      const event = await this.teamEventRepository.findOneOrFail({ teamEventId: query.eventId }, { populate: ['team', 'team.members'] });
      if (!event.canEdit(user))
        throw new ForbiddenException('Cannot view registrations');
      filter = { ...filter, event: { teamEventId: query.eventId } };
    } else if (query.userId && (user.roles.includes(Role.ClubManager) || user.roles.includes(Role.Admin))) {
      filter = { ...filter, user: { userId: query.userId } };
    } else {
      filter = { ...filter, user };
    }

    return await this.teamEventRegistrationRepository.findWithPagination(
      options,
      filter,
      { orderBy: { createdAt: 'ASC' }, populate: ['user', 'event', 'event.team'] },
    );
  }

  public async findOne(user: User, teamEventRegistrationId: number): Promise<TeamEventRegistration> {
    const registration = await this.teamEventRegistrationRepository.findOneOrFail({ teamEventRegistrationId }, { populate: ['user', 'event', 'event.team'] });

    if (registration.event.private) {
      const membership = await this.teamMemberRepository.findOne({
        user,
        team: { teamId: registration.event.team.teamId },
      });
      if (!membership)
        throw new ForbiddenException('Not a team member');
    }

    return registration;
  }

  public async remove(user: User, teamEventRegistrationId: number): Promise<void> {
    const registration = await this.teamEventRegistrationRepository.findOneOrFail({ teamEventRegistrationId });
    const event = await this.teamEventRepository.findOneOrFail({ teamEventId: registration.event.teamEventId }, { populate: ['team', 'team.members'] });

    if (
      !event.team.canAdminister(user)
      && event.createdBy.userId !== user.userId
      && registration.user.userId !== user.userId
    )
      throw new ForbiddenException('Cannot unregister');

    await this.teamEventRegistrationRepository.removeAndFlush(registration);
  }

  private async getAndValidateFormSubmission(
    teamForm?: TeamForm | null,
    askedFormId?: number | null,
    formSubmission?: object | null,
  ): Promise<{ formSubmission?: object | null; originalForm?: TeamForm | null }> {
    if (teamForm && askedFormId && formSubmission) {
      if (askedFormId !== teamForm.teamFormId)
        throw new BadRequestException('Wrong form');

      const form = await this.teamFormRepository.findOneOrFail({ teamFormId: askedFormId });
      if (form.isTemplate)
        throw new BadRequestException('Form is a template');

      return { formSubmission, originalForm: form };
    }

    // Step 3 + Step 4 + Step 5 — We cannot update the form submission / original form individually,
    // and even less if there is a required form
    if (teamForm || askedFormId || formSubmission)
      throw new BadRequestException('Invalid form entries');

    // Step 6 — Either one of form submission / original form are all null, so we set them all to null
    return { formSubmission: null, originalForm: null };
  }
}
