import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
// Import { SerializerIncludeTeamForm } from '../../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { MembershipRequestsListOptions } from '../dto/membership-requests-list-options.dto';
import { Team } from '../teams/team.entity';
import { CreateTeamMembershipRequestDto } from './dto/create-membership-request.dto';
import { PutTeamMembershipRequestDto } from './dto/put-membership-request.dto';
import { UpdateTeamMembershipRequestDto } from './dto/update-membership-request.dto';
import { TeamMembershipRequestsService } from './requests.service';
import type { TeamMembershipRequest } from './team-membership-request.entity';

@ApiTags('Team Membership Requests')
@Controller()
// @SerializerIncludeTeamForm()
export class TeamMembershipRequestsController {
  constructor(
    private readonly requestsService: TeamMembershipRequestsService,
  ) {}

  @Post(':teamId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async create(
    @CurrentUser() user: User,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() createTeamMembershipRequestDto: CreateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    return await this.requestsService.create(user, teamId, createTeamMembershipRequestDto);
  }

  @Get(':teamId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findAll(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query() query: MembershipRequestsListOptions,
  ): Promise<PaginatedResult<TeamMembershipRequest>> {
    return await this.requestsService.findAll(teamId, normalizePagination(query));
  }

  @Patch(':requestId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async update(
    @CurrentUser() user: User,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() updateTeamMembershipRequestDto: UpdateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    return await this.requestsService.update(user, requestId, updateTeamMembershipRequestDto);
  }

  @Put(':requestId')
  // Give read permission only, because standard users use the same endpoint to accept/reject invitations.
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async handleRequest(
    @CurrentUser() user: User,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() updateTeamMembershipRequestDto: PutTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    return await this.requestsService.handleRequest(user, requestId, updateTeamMembershipRequestDto);
  }
}
