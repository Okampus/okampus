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
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { SerializerIncludeTeamMembers, SerializerTeamMemberIncludeTeam } from '../shared/lib/decorators/serializers.decorator';
import { TypesenseEnabledGuard } from '../shared/lib/guards/typesense-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { SearchDto } from '../shared/modules/search/search.dto';
import { User } from '../users/user.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamListOptions } from './dto/team-list-options.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import type { TeamMember } from './entities/team-member.entity';
import { Team } from './entities/team.entity';
import type { IndexedTeam } from './team-search.service';
import { TeamSearchService } from './team-search.service';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller({ path: 'teams' })
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

  @Get('/memberships/:userId')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  @SerializerTeamMemberIncludeTeam()
  public async findTeamMemberships(
    @Param('userId') userId: string,
  ): Promise<PaginatedResult<TeamMember>> {
    return this.teamsService.findTeamMembership(userId);
  }

  @Get(':teamId/members')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  @SerializerTeamMemberIncludeTeam()
  public async findAllUsersInTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<TeamMember>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.teamsService.findAllUsersInTeam(teamId, options);
    }
    return await this.teamsService.findAllUsersInTeam(teamId);
  }

  @Post(':teamId/members/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerTeamMemberIncludeTeam()
  public async addUserToTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @CurrentUser() requester: User,
  ): Promise<TeamMember> {
    return await this.teamsService.addUserToTeam(requester, teamId, userId, createTeamMemberDto);
  }

  @Patch(':teamId/members/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerTeamMemberIncludeTeam()
  public async updateUserRole(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @CurrentUser() requester: User,
  ): Promise<TeamMember> {
    return await this.teamsService.updateUserRole(requester, teamId, userId, updateTeamMemberDto);
  }

  @Delete(':teamId/members/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerIncludeTeamMembers()
  public async removeUserFromTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<void> {
    await this.teamsService.removeUserFromTeam(requester, teamId, userId);
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
