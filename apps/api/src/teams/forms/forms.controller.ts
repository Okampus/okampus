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
import { CreateTeamFormDto } from './dto/create-team-form.dto';
import { ListTeamFormsDto } from './dto/list-team-forms.dto';
import { UpdateTeamFormDto } from './dto/update-team-form.dto';
import { TeamFormsService } from './forms.service';
import { TeamForm } from './team-form.entity';

@ApiTags('Team Forms')
@Controller()
export class TeamFormsController {
  constructor(
    private readonly teamFormsService: TeamFormsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, TeamForm))
  public async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTeamFormDto: CreateTeamFormDto,
    @CurrentUser() user: User,
  ): Promise<TeamForm> {
    return await this.teamFormsService.create(user, id, createTeamFormDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamForm))
  public async findAll(
    @Query() query: ListTeamFormsDto,
  ): Promise<PaginatedResult<TeamForm>> {
    return await this.teamFormsService.findAll(query, normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamForm))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TeamForm> {
    return await this.teamFormsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamForm))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamFormDto: UpdateTeamFormDto,
    @CurrentUser() user: User,
  ): Promise<TeamForm> {
    return await this.teamFormsService.update(user, id, updateTeamFormDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamForm))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamFormsService.remove(user, id);
  }
}
