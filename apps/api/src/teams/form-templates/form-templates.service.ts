import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { ListOptionsDto } from '../../shared/lib/dto/list-options.dto';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult } from '../../shared/modules/pagination';
import type { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';
import type { CreateTeamFormTemplateDto } from './dto/create-team-form-template.dto';
import type { ListTeamFormTemplatesDto } from './dto/list-team-form-templates.dto';
import type { UpdateTeamFormTemplateDto } from './dto/update-team-form-template.dto';
import { TeamFormTemplate } from './team-form-template.entity';

@Injectable()
export class TeamFormTemplatesService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
    @InjectRepository(TeamFormTemplate) private readonly teamFormTemplateRepository: BaseRepository<TeamFormTemplate>,
  ) {}

  public async create(
    user: User,
    teamId: number,
    createFormTemplateDto: CreateTeamFormTemplateDto,
  ): Promise<TeamFormTemplate> {
    const team = await this.teamRepository.findOneOrFail({ teamId }, { populate: ['members'] });

    if (!team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    const form = new TeamFormTemplate({
      ...createFormTemplateDto,
      team,
      createdBy: user,
    });

    await this.teamFormTemplateRepository.persistAndFlush(form);
    return form;
  }

  public async findAll(
    query: ListTeamFormTemplatesDto,
    options?: Required<ListOptionsDto>,
  ): Promise<PaginatedResult<TeamFormTemplate>> {
    const forms = await this.teamFormTemplateRepository.findWithPagination(
      options,
      { team: { teamId: query.teamId } },
      { populate: ['createdBy', 'team'] },
    );
    return forms;
  }

  public async findOne(teamFormTemplateId: number): Promise<TeamFormTemplate> {
    return await this.teamFormTemplateRepository.findOneOrFail(
      { teamFormTemplateId },
      { populate: ['createdBy', 'team'] },
    );
  }

  public async update(
    user: User,
    teamFormTemplateId: number,
    updateTeamFormTemplateDto: UpdateTeamFormTemplateDto,
  ): Promise<TeamFormTemplate> {
    const form = await this.teamFormTemplateRepository.findOneOrFail(
      { teamFormTemplateId },
      { populate: ['createdBy', 'team', 'team.members'] },
    );

    if (!form.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    wrap(form).assign(updateTeamFormTemplateDto);
    await this.teamFormTemplateRepository.flush();
    return form;
  }

  public async remove(user: User, teamFormTemplateId: number): Promise<void> {
    const form = await this.teamFormTemplateRepository.findOneOrFail(
      { teamFormTemplateId },
      { populate: ['createdBy', 'team', 'team.members'] },
    );

    if (!form.team.canAdminister(user))
      throw new ForbiddenException('Not a team admin');

    await this.teamFormTemplateRepository.removeAndFlush(form);
  }
}
