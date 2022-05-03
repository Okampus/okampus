import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SerializerTeamMemberIncludeTeam } from '../../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { MembershipRequestsListOptions } from '../dto/membership-requests-list-options.dto';
import type { TeamMember } from '../members/team-member.entity';
import type { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { TeamMembershipsService } from './memberships.service';

@ApiTags('Team Memberships')
@Controller()
export class TeamMembershipsController {
  constructor(
    private readonly membershipsService: TeamMembershipsService,
) {}

  @Get(':userId')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  @SerializerTeamMemberIncludeTeam()
  public async findOne(
    @Param('userId') userId: string,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.membershipsService.findOne(userId);
  }

  @Get(':userId/requests')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  public async findAll(
    @Param('userId') userId: string,
    @Query() query: MembershipRequestsListOptions,
  ): Promise<PaginatedResult<TeamMembershipRequest>> {
    return await this.membershipsService.findAll(userId, normalizePagination(query));
  }
}
