import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { ListOptionsDto } from '@common/lib/dto/list-options.dto';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { EventState } from '@common/lib/types/enums/event-state.enum';
import type { PaginatedResult } from '@common/modules/pagination';
import type { CreateTeamFinanceDto } from '@modules/org/teams/finances/dto/create-team-finance.dto';
import { Team } from '@modules/org/teams/team.entity';
import { Event } from '@modules/plan/events/event.entity';
import { User } from '@modules/uaa/users/user.entity';
import { TeamFile } from '@modules/upload/team-files/team-file.entity';
import type { ListTeamFinancesDto } from './dto/list-team-finances.dto';
import type { UpdateTeamFinanceDto } from './dto/update-team-finance.dto';
import { TeamFinance } from './team-finance.entity';

@Injectable()
export class TeamFinancesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    @InjectRepository(TeamFinance) private readonly teamFinanceRepository: BaseRepository<TeamFinance>,
    @InjectRepository(TeamFile) private readonly teamFileRepository: BaseRepository<TeamFile>,
  ) {}

  public async create(
    user: User,
    id: number,
    createTeamFinanceDto: CreateTeamFinanceDto,
  ): Promise<TeamFinance> {
    const team = await this.teamRepository.findOneOrFail({ id }, { populate: ['members'] });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    let dueTo: User | undefined;
    if (typeof createTeamFinanceDto.dueTo !== 'undefined')
      dueTo = await this.userRepository.findOneOrFail({ id: createTeamFinanceDto.dueTo });

    let event: Event | undefined;
    if (typeof createTeamFinanceDto.event !== 'undefined') {
      event = await this.eventRepository.findOneOrFail({
        id: createTeamFinanceDto.event,
        state: { $ne: EventState.Template },
      });
    }

    let receipt: TeamFile | undefined;
    if (typeof createTeamFinanceDto.receipt !== 'undefined')
      receipt = await this.teamFileRepository.findOneOrFail({ id: createTeamFinanceDto.receipt });

    const finance = new TeamFinance({
      ...createTeamFinanceDto,
      dueTo,
      event,
      team,
      receipt,
      createdBy: user,
    });

    await this.teamFinanceRepository.persistAndFlush(finance);
    return finance;
  }

  public async findAll(
    query: ListTeamFinancesDto,
    options?: Required<ListOptionsDto>,
  ): Promise<PaginatedResult<TeamFinance>> {
    const filters: FilterQuery<TeamFinance> = { team: { id: query.id } };

    if (typeof query.type !== 'undefined')
      filters.type = query.type;
    if (typeof query.category !== 'undefined')
      filters.category = query.category;
    if (typeof query.dueTo !== 'undefined')
      filters.dueTo = { id: query.dueTo };
    if (typeof query.event !== 'undefined')
      filters.event = { id: query.event };

    return await this.teamFinanceRepository.findWithPagination(
      options,
      filters,
      { populate: ['createdBy', 'team', 'dueTo', 'event', 'receipt'] },
    );
  }

  public async findOne(id: number): Promise<TeamFinance> {
    return await this.teamFinanceRepository.findOneOrFail(
      { id },
      { populate: ['createdBy', 'team', 'dueTo', 'event', 'receipt'] },
    );
  }

  public async update(
    user: User,
    id: number,
    updateTeamFinanceDto: UpdateTeamFinanceDto,
  ): Promise<TeamFinance> {
    const finance = await this.teamFinanceRepository.findOneOrFail(
      { id },
      { populate: ['team', 'team.members'] },
    );

    if (!finance.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const {
      dueTo,
      event,
      receipt,
      ...dto
    } = updateTeamFinanceDto;

    if (typeof dueTo !== 'undefined') {
      finance.dueTo = typeof dueTo === 'string'
        ? await this.userRepository.findOneOrFail({ id: dueTo })
        : null;
    }

    if (typeof event !== 'undefined') {
      finance.event = typeof event === 'number'
        ? await this.eventRepository.findOneOrFail({ id: event })
        : null;
    }

    if (typeof receipt !== 'undefined') {
      finance.receipt = typeof receipt === 'number'
        ? await this.teamFileRepository.findOneOrFail({ id: receipt })
        : null;
    }

    wrap(finance).assign(dto);
    await this.teamFinanceRepository.flush();
    return finance;
  }

  public async remove(user: User, id: number): Promise<void> {
    const finance = await this.teamFinanceRepository.findOneOrFail(
      { id },
      { populate: ['team', 'team.members'] },
    );

    if (!finance.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamFinanceRepository.removeAndFlush(finance);
  }
}
