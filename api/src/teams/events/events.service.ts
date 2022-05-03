import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { ListOptionsDto } from '../../shared/lib/dto/list-options.dto';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { serializeOrder } from '../../shared/modules/sorting';
import { User } from '../../users/user.entity';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import type { CreateTeamEventDto } from './dto/create-team-event.dto';
import type { ListTeamEventsDto } from './dto/list-team-events.dto';
import type { UpdateTeamEventDto } from './dto/update-team-event.dto';
import { TeamEvent } from './team-event.entity';

@Injectable()
export class TeamEventsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async create(user: User, teamId: number, createTeamDto: CreateTeamEventDto): Promise<TeamEvent> {
    const team = await this.teamRepository.findOneOrFail({ teamId }, { populate: ['members'] });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    let supervisor: User | null = null;
    if (createTeamDto.supervisor)
      supervisor = await this.userRepository.findOneOrFail({ userId: createTeamDto.supervisor });

    const event = new TeamEvent({
      ...createTeamDto,
      supervisor,
      team,
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
      filter = { ...filter, team: { teamId: query.teamId }, private: false };
    } else if (query.teamId) {
      filter = { ...filter, team: { teamId: query.teamId } };
    } else {
      filter = {
        $or: [
          { private: true, team: { $in: teamIds } },
          { private: false },
        ],
      };
    }
    if (typeof query.priceBelow !== 'undefined')
      filter = { ...filter, price: { $lte: query.priceBelow } };
    if (query.before)
      filter = { ...filter, start: { $lte: query.before } };
    if (query.after)
      filter = { ...filter, start: { $gte: query.after } };

    return await this.teamEventRepository.findWithPagination(
      options,
      filter,
      { orderBy: serializeOrder(options?.sortBy, 'start'), populate: ['supervisor', 'createdBy', 'team'] },
    );
  }

  public async findOne(user: User, teamEventId: number): Promise<TeamEvent> {
    const memberships = await this.teamMemberRepository.find({ user });
    const teamIds = memberships.map(m => m.team.teamId);

    return await this.teamEventRepository.findOneOrFail(
      {
        teamEventId,
        $or: [
          { private: true, team: { $in: teamIds } },
          { private: false },
        ],
      },
      { populate: ['supervisor', 'createdBy', 'team'] },
    );
  }

  public async update(
    user: User,
    teamEventId: number,
    updateTeamDto: UpdateTeamEventDto,
  ): Promise<TeamEvent> {
    const event = await this.teamEventRepository.findOneOrFail({ teamEventId }, { populate: ['team', 'team.members'] });

    if (!event.canEdit(user))
      throw new ForbiddenException('Not a team admin');

    const { supervisor, ...dto } = updateTeamDto;

    if (supervisor) {
      const supervisorUser = await this.userRepository.findOneOrFail({ userId: supervisor });
      event.supervisor = supervisorUser;
    }

    wrap(event).assign(dto);
    await this.teamEventRepository.flush();
    return event;
  }

  public async remove(user: User, teamEventId: number): Promise<void> {
    const event = await this.teamEventRepository.findOneOrFail({ teamEventId });
    if (!event.canEdit(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamEventRepository.removeAndFlush(event);
  }
}
