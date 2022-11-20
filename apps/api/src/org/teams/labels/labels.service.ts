import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '../../../shared/modules/pagination';
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
    const label = new TeamLabel(createLabelDto);
    try {
      await this.labelRepository.persistAndFlush(label);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Label id/slug already exists');
      throw error;
    }
    return label;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<TeamLabel>> {
    return await this.labelRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: string): Promise<TeamLabel> {
    return await this.labelRepository.findOneOrFail({ id });
  }

  public async update(id: string, updateLabelDto: UpdateLabelDto): Promise<TeamLabel> {
    const label = await this.labelRepository.findOneOrFail({ id });

    wrap(label).assign(updateLabelDto);
    await this.labelRepository.flush();
    return label;
  }

  public async remove(id: string): Promise<void> {
    const label = await this.labelRepository.findOneOrFail({ id });
    await this.labelRepository.removeAndFlush(label);
  }
}
