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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { SerializerIncludeTeamMembers } from '../../shared/lib/decorators/serializers.decorator';
import { TypesenseEnabledGuard } from '../../shared/lib/guards/typesense-enabled.guard';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { SearchDto } from '../../shared/modules/search/search.dto';
import { User } from '../../users/user.entity';
import { TeamListOptions } from '../dto/team-list-options.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import type { IndexedTeam } from './team-search.service';
import { TeamSearchService } from './team-search.service';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller()
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamSearchService: TeamSearchService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Team))
  @SerializerIncludeTeamMembers()
  public async create(
    @Body() createTagDto: CreateTeamDto,
    @CurrentUser() user: User,
  ): Promise<Team> {
    return await this.teamsService.create(user, createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  @SerializerIncludeTeamMembers()
  public async findAll(
    @Query() options: TeamListOptions,
    ): Promise<PaginatedResult<Team>> {
    return await this.teamsService.findAll(options, normalizePagination(options));
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedTeam> | SearchResponse<Team>> {
    if (full)
      return await this.teamSearchService.searchAndPopulate(query);
    return await this.teamSearchService.search(query);
  }

  @Get('/names')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findNames(): Promise<Array<Pick<Team, 'avatar' | 'name' | 'teamId'>>> {
    return await this.teamsService.findNames();
  }

  @Get(':teamId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  @SerializerIncludeTeamMembers()
  public async findOne(@Param('teamId', ParseIntPipe) teamId: number): Promise<Team> {
    return await this.teamsService.findOne(teamId);
  }

  @Patch(':teamId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerIncludeTeamMembers()
  public async update(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() updateSubjectDto: UpdateTeamDto,
    @CurrentUser() requester: User,
  ): Promise<Team> {
    return await this.teamsService.update(requester, teamId, updateSubjectDto);
  }

  @Delete(':teamId')
  @CheckPolicies(ability => ability.can(Action.Delete, Team))
  @SerializerIncludeTeamMembers()
  public async remove(@Param('teamId', ParseIntPipe) teamId: number): Promise<void> {
    await this.teamsService.remove(teamId);
  }
}
