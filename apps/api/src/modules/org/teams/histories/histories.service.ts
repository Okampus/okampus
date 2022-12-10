import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { BaseRepository } from '@lib/orm/base.repository';
import type { CreateHistoryDto } from '@teams/histories/dto/create-history.dto';
import { Team } from '@teams/team.entity';
import type { UpdateHistoryDto } from './dto/update-history.dto';
import { TeamHistory } from './team-history.entity';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(TeamHistory) private readonly historyRepository: BaseRepository<TeamHistory>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
  ) {}

  public async create(createHistoryDto: CreateHistoryDto): Promise<TeamHistory> {
    const { parentId, teamId, ...createHistory } = createHistoryDto;

    const parent = (typeof parentId === 'number')
      ? await this.teamRepository.findOneOrFail({ id: parentId })
      : null;

    const team = await this.teamRepository.findOneOrFail({ id: teamId });

    const history = new TeamHistory({ ...createHistory, parent, team });
    try {
      await this.historyRepository.persistAndFlush(history);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('History id already exists');
      throw error;
    }
    return history;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedNodes<TeamHistory>> {
    return await this.historyRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: number): Promise<TeamHistory> {
    return await this.historyRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateHistoryDto: UpdateHistoryDto): Promise<TeamHistory> {
    const history = await this.historyRepository.findOneOrFail({ id });

    const { parentId, ...updateHistory } = updateHistoryDto;

    const parent = (typeof parentId === 'string')
      ? await this.teamRepository.findOneOrFail({ id: parentId })
      : null;

    wrap(history).assign({ ...updateHistory, parent });
    await this.historyRepository.flush();
    return history;
  }

  public async remove(id: number): Promise<void> {
    const history = await this.historyRepository.findOneOrFail({ id });
    await this.historyRepository.removeAndFlush(history);
  }
}
