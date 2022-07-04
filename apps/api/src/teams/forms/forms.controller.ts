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
import { SerializerTeamFormIncludeTeam } from '../../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { CreateTeamFormDto } from './dto/create-team-form.dto';
import { ListTeamFormsDto } from './dto/list-team-forms.dto';
import { UpdateTeamFormDto } from './dto/update-team-form.dto';
import { TeamFormsService } from './forms.service';
import { TeamForm } from './team-form.entity';

@ApiTags('Team Forms')
@Controller()
@SerializerTeamFormIncludeTeam()
export class TeamFormsController {
  constructor(
    private readonly teamFormsService: TeamFormsService,
  ) {}

  @Post(':teamId')
  @CheckPolicies(ability => ability.can(Action.Create, TeamForm))
  public async create(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() createTeamFormDto: CreateTeamFormDto,
    @CurrentUser() user: User,
  ): Promise<TeamForm> {
    return await this.teamFormsService.create(user, teamId, createTeamFormDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamForm))
  public async findAll(
    @Query() query: ListTeamFormsDto,
  ): Promise<PaginatedResult<TeamForm>> {
    return await this.teamFormsService.findAll(query, normalizePagination(query));
  }

  @Get(':formId')
  @CheckPolicies(ability => ability.can(Action.Read, TeamForm))
  public async findOne(
    @Param('formId', ParseIntPipe) formId: number,
  ): Promise<TeamForm> {
    return await this.teamFormsService.findOne(formId);
  }

  @Patch(':formId')
  @CheckPolicies(ability => ability.can(Action.Update, TeamForm))
  public async update(
    @Param('formId', ParseIntPipe) formId: number,
    @Body() updateTeamFormDto: UpdateTeamFormDto,
    @CurrentUser() user: User,
  ): Promise<TeamForm> {
    return await this.teamFormsService.update(user, formId, updateTeamFormDto);
  }

  @Delete(':formId')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamForm))
  public async remove(
    @Param('formId', ParseIntPipe) formId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamFormsService.remove(user, formId);
  }
}
