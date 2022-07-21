import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { ListOptionsDto } from '../../shared/lib/dto/list-options.dto';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult } from '../../shared/modules/pagination';
import type { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';
import type { CreateTeamFormDto } from './dto/create-team-form.dto';
import type { ListTeamFormsDto } from './dto/list-team-forms.dto';
import type { UpdateTeamFormDto } from './dto/update-team-form.dto';
import { TeamForm } from './team-form.entity';

@Injectable()
export class TeamFormsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
  ) {}

  public async create(
    user: User,
    id: number,
    createFormDto: CreateTeamFormDto,
  ): Promise<TeamForm> {
    const team = await this.teamRepository.findOneOrFail({ id }, { populate: ['members'] });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const form = new TeamForm({
      ...createFormDto,
      team,
      createdBy: user,
    });

    await this.teamFormRepository.persistAndFlush(form);
    return form;
  }

  public async findAll(
    query: ListTeamFormsDto,
    options?: Required<ListOptionsDto>,
  ): Promise<PaginatedResult<TeamForm>> {
    return await this.teamFormRepository.findWithPagination(
      options,
      { team: { id: query.id }, isTemplate: query.isTemplate },
      { populate: ['createdBy', 'team'] },
    );
  }

  public async findOne(id: number): Promise<TeamForm> {
    return await this.teamFormRepository.findOneOrFail(
      { id },
      { populate: ['createdBy', 'team'] },
    );
  }

  public async update(
    user: User,
    id: number,
    updateTeamFormDto: UpdateTeamFormDto,
  ): Promise<TeamForm> {
    const form = await this.teamFormRepository.findOneOrFail(
      { id },
      { populate: ['createdBy', 'team', 'team.members'] },
    );

    if (!form.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    wrap(form).assign(updateTeamFormDto);
    await this.teamFormRepository.flush();
    return form;
  }

  public async remove(user: User, id: number): Promise<void> {
    const form = await this.teamFormRepository.findOneOrFail(
      { id },
      { populate: ['createdBy', 'team', 'team.members'] },
    );

    if (!form.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamFormRepository.removeAndFlush(form);
  }
}
