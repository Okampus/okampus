import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import type { ListOptionsDto } from '../../shared/lib/dto/list-options.dto';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { TeamEventState } from '../../shared/lib/types/enums/team-event-state.enum';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { serializeOrder } from '../../shared/modules/sorting';
import { User } from '../../users/user.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import type { CreateTeamEventDto } from './dto/create-team-event.dto';
import type { ListTeamEventsDto } from './dto/list-team-events.dto';
import type { UpdateTeamEventDto } from './dto/update-team-event.dto';
import { TeamEvent } from './team-event.entity';

@Injectable()
export class TeamEventsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(TeamEventRegistration)
    private readonly teamEventRegistrationRepository: BaseRepository<TeamEventRegistration>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async create(user: User, teamId: number, createTeamEventDto: CreateTeamEventDto): Promise<TeamEvent> {
    const team = await this.teamRepository.findOneOrFail({ teamId }, { populate: ['members'] });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    // Check that the provided supervisor id is valid
    let supervisor: User | undefined;
    if (createTeamEventDto.supervisorId)
      supervisor = await this.userRepository.findOneOrFail({ userId: createTeamEventDto.supervisorId });

    // Check that the provided form id is valid, is a template, and is not already used
    let form: TeamForm | undefined;
    if (createTeamEventDto.formId) {
      form = await this.teamFormRepository.findOneOrFail({ teamFormId: createTeamEventDto.formId, team });
      if (form.isTemplate)
        throw new BadRequestException('Form is a template');

      const isAlreadyUsed = await this.teamEventRepository.findOne({ form });
      if (isAlreadyUsed)
        throw new BadRequestException('Form is already used');
    }

    // Check that the provided event template id is valid and is a template
    let usedTemplate: TeamEvent | undefined;
    if (createTeamEventDto.templateId && createTeamEventDto.state !== TeamEventState.Template) {
      usedTemplate = await this.teamEventRepository.findOneOrFail({ teamEventId: createTeamEventDto.templateId, team });
      if (usedTemplate.state !== TeamEventState.Template)
        throw new BadRequestException('Template is not a template');
    }

    const event = new TeamEvent({
      ...createTeamEventDto,
      supervisor,
      usedTemplate,
      team,
      form,
      createdBy: user,
    });

    await this.teamEventRepository.persistAndFlush(event);
    return event;
  }

  public async findAll(
    user: User,
    query: ListTeamEventsDto,
    options?: Required<ListOptionsDto>,
  ): Promise<PaginatedResult<TeamEvent>> {
    const memberships = await this.teamMemberRepository.find({ user });
    const teamIds = memberships.map(m => m.team.teamId);

    let filter: FilterQuery<TeamEvent> = {};
    if (query.teamId && !teamIds.includes(query.teamId)) {
      // We asked for the events of a team that the user is not a member of
      // so we only search for public & published events
      filter = {
        team: { teamId: query.teamId },
        private: false,
        state: TeamEventState.Published,
      };
    } else if (query.teamId) {
      // We asked for the events of a team that the user is a member of
      // so we search for all events, private or not.
      filter = {
        team: { teamId: query.teamId },
        state: query.state ?? TeamEventState.Published,
      };
    } else {
      // We asked for all the events of all teams
      // so we search for the public & private events of the teams the user is a member of
      // and the public & published events of the teams the user is not a member of
      filter = {
        $or: [
          { team: { $in: teamIds }, state: query.state ?? TeamEventState.Published },
          { team: { $nin: teamIds }, private: false, state: TeamEventState.Published },
        ],
      };
    }
    if (typeof query.priceBelow !== 'undefined')
      filter = { ...filter, price: { $lte: query.priceBelow } };
    if (query.before)
      filter = { ...filter, start: { $lte: query.before } };
    if (query.after)
      filter = { ...filter, start: { $gte: query.after } };

    const events = await this.teamEventRepository.findWithPagination(
      options,
      filter,
      { orderBy: serializeOrder(options?.sortBy, 'start'), populate: ['supervisor', 'createdBy', 'team'] },
    );

    const allRegistrations = await this.teamEventRegistrationRepository.find({ user });

    events.items = events.items.map((event) => {
      // TODO: Maybe find a better way to add these properties? Something virtual? computed on-the-fly? added elsewhere?
      // @ts-expect-error: We add a new property to the object, but it's fine.
      event.isRegistered = allRegistrations.some(r => r.event.teamEventId === event.teamEventId);
      return event;
    });

    return events;
  }

  public async findOne(user: User, teamEventId: number): Promise<TeamEvent> {
    const memberships = await this.teamMemberRepository.find({ user });
    const teamIds = memberships.map(m => m.team.teamId);

    const event = await this.teamEventRepository.findOneOrFail(
      {
        teamEventId,
        $or: [
          { team: { $in: teamIds } },
          { private: false, state: TeamEventState.Published },
        ],
      },
      { populate: ['supervisor', 'createdBy', 'team', 'team.members', 'form', 'usedTemplate'] },
    );
    if (event.state === TeamEventState.Draft && !event.canEdit(user))
      throw new ForbiddenException('Event not published');

    return event;
  }

  public async update(
    user: User,
    teamEventId: number,
    updateTeamEventDto: UpdateTeamEventDto,
  ): Promise<TeamEvent> {
    const event = await this.teamEventRepository.findOneOrFail({ teamEventId }, { populate: ['team', 'team.members'] });

    if (!event.canEdit(user))
      throw new ForbiddenException('Not a team admin');

    if (event.state === TeamEventState.Template && 'state' in updateTeamEventDto)
      throw new BadRequestException('Cannot change state of a template');

    const { supervisorId, ...dto } = updateTeamEventDto;

    // Check that the provided supervisor id is valid
    if (typeof supervisorId !== 'undefined') {
      const supervisorUser = await this.userRepository.findOneOrFail({ userId: supervisorId });
      event.supervisor = supervisorUser;
    }

    // Check that the provided form id is valid, is a template, and is not already used
    let form: TeamForm | undefined;
    if (updateTeamEventDto.formId) {
      form = await this.teamFormRepository.findOneOrFail({ teamFormId: updateTeamEventDto.formId, team: event.team });
      if (form.isTemplate)
        throw new BadRequestException('Form is a template');

      const isAlreadyUsed = await this.teamEventRepository.findOne({ form });
      if (isAlreadyUsed)
        throw new BadRequestException('Form is already used');
    }

    wrap(event).assign(dto);
    await this.teamEventRepository.flush();
    return event;
  }

  public async remove(user: User, teamEventId: number): Promise<void> {
    const event = await this.teamEventRepository.findOneOrFail({ teamEventId }, { populate: ['team', 'team.members'] });
    if (!event.canEdit(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamEventRepository.removeAndFlush(event);
  }
}
