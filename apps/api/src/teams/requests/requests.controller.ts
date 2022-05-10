import {
  Body,
  Controller,
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
import { MembershipRequestsListOptions } from '../dto/membership-requests-list-options.dto';
import { Team } from '../teams/team.entity';
import { UpdateTeamMembershipRequestDto } from './dto/update-membership-request.dto';
import { TeamMembershipRequestsService } from './requests.service';
import type { TeamMembershipRequest } from './team-membership-request.entity';

@ApiTags('Team Membership Requests')
@Controller()
export class TeamMembershipRequestsController {
  constructor(
    private readonly requestsService: TeamMembershipRequestsService,
  ) {}

  @Post(':teamId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async create(
    @CurrentUser() user: User,
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<TeamMembershipRequest> {
    return await this.requestsService.create(user, teamId);
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
  // Give read permission only, because standard users use the same endpoint to accept/reject invitations.
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async handleRequest(
    @CurrentUser() user: User,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() updateTeamMembershipRequestDto: UpdateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    return await this.requestsService.handleRequest(user, requestId, updateTeamMembershipRequestDto.state);
  }
}
