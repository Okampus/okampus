import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import { Team } from '../teams/team.entity';
import type { CreateLabelDto } from './dto/create-label.dto';
import type { UpdateLabelDto } from './dto/update-label.dto';
import { TeamLabel } from './team-label.entity';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(TeamLabel) private readonly labelRepository: BaseRepository<TeamLabel>,
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
  ) {}

  public async create(createLabelDto: CreateLabelDto): Promise<TeamLabel> {
    const { parentId, teamId, ...createLabel } = createLabelDto;

    const parent = (typeof parentId === 'number')
      ? await this.teamRepository.findOneOrFail({ id: parentId })
      : null;

    const team = await this.teamRepository.findOneOrFail({ id: teamId });

    const subject = new TeamLabel({ ...createLabel, parent, team });
    try {
      await this.labelRepository.persistAndFlush(subject);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Subject code already exists');
      throw error;
    }
    return subject;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<TeamLabel>> {
    return await this.labelRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: number): Promise<TeamLabel> {
    return await this.labelRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateHistoryDto: UpdateLabelDto): Promise<TeamLabel> {
    const history = await this.labelRepository.findOneOrFail({ id });

    const { parentId, ...updateHistory } = updateHistoryDto;

    const parent = (typeof parentId === 'string')
      ? await this.teamRepository.findOneOrFail({ id: parentId })
      : null;

    wrap(history).assign({ ...updateHistory, parent });
    await this.labelRepository.flush();
    return history;
  }

  public async remove(id: number): Promise<void> {
    const subject = await this.labelRepository.findOneOrFail({ id });
    await this.labelRepository.removeAndFlush(subject);
  }
}
