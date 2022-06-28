import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { Role } from '../../shared/modules/authorization/types/role.enum';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import { TeamMember } from '../members/team-member.entity';
import type { ListRegisteredEventsDto } from './dto/list-registered-events.dto';
import { TeamEventRegistration } from './team-event-registration.entity';

@Injectable()
export class TeamEventRegistrationsService {
  constructor(
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(TeamEventRegistration)
    private readonly teamEventRegistrationRepository: BaseRepository<TeamEventRegistration>,
  ) {}

  public async create(user: User, teamEventId: number): Promise<TeamEventRegistration> {
    const event = await this.teamEventRepository.findOneOrFail({ teamEventId }, { populate: ['createdBy', 'team'] });

    if (event.private) {
      const membership = await this.teamMemberRepository.findOne({ user, team: { teamId: event.team.teamId } });
      if (!membership)
        throw new ForbiddenException('Not a team member');
    }

    const existing = await this.teamEventRegistrationRepository.count({ user, event: { teamEventId } });
    if (existing)
      throw new BadRequestException('Already registered');

    const registration = new TeamEventRegistration({ user, event });

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
}
