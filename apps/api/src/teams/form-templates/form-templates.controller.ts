import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { CreateTeamFormTemplateDto } from './dto/create-team-form-template.dto';
import { ListTeamFormTemplatesDto } from './dto/list-team-form-templates.dto';
import { UpdateTeamFormTemplateDto } from './dto/update-team-form-template.dto';
import { TeamFormTemplatesService } from './form-templates.service';
import { TeamFormTemplate } from './team-form-template.entity';

@ApiTags('Team Form Templates')
@Controller()
export class TeamFormTemplatesController {
  constructor(
    private readonly teamFormTemplatesService: TeamFormTemplatesService,
  ) {}

  @Post(':teamId')
  @CheckPolicies(ability => ability.can(Action.Create, TeamFormTemplate))
  public async create(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() createTeamFormTemplateDto: CreateTeamFormTemplateDto,
    @CurrentUser() user: User,
  ): Promise<TeamFormTemplate> {
    return await this.teamFormTemplatesService.create(user, teamId, createTeamFormTemplateDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamFormTemplate))
  public async findAll(
    @Query() query: ListTeamFormTemplatesDto,
  ): Promise<PaginatedResult<TeamFormTemplate>> {
    return await this.teamFormTemplatesService.findAll(query, normalizePagination(query));
  }

  @Get(':formTemplateId')
  @CheckPolicies(ability => ability.can(Action.Read, TeamFormTemplate))
  public async findOne(
    @Param('formTemplateId', ParseIntPipe) formTemplateId: number,
  ): Promise<TeamFormTemplate> {
    return await this.teamFormTemplatesService.findOne(formTemplateId);
  }

  @Patch(':formTemplateId')
  @CheckPolicies(ability => ability.can(Action.Update, TeamFormTemplate))
  public async update(
    @Param('formTemplateId', ParseIntPipe) formTemplateId: number,
    @Body() updateTeamFormTemplateDto: UpdateTeamFormTemplateDto,
    @CurrentUser() user: User,
  ): Promise<TeamFormTemplate> {
    return await this.teamFormTemplatesService.update(user, formTemplateId, updateTeamFormTemplateDto);
  }

  @Delete(':formTemplateId')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamFormTemplate))
  public async remove(
    @Param('formTemplateId', ParseIntPipe) formTemplateId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamFormTemplatesService.remove(user, formTemplateId);
  }
}
