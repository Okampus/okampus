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
import { MembershipsService } from './memberships.service';

@ApiTags('Teams Memberships')
@Controller()
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
) {}

  @Get(':userId')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  @SerializerTeamMemberIncludeTeam()
  public async findTeamMemberships(
    @Param('userId') userId: string,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.membershipsService.findTeamMembership(userId);
  }

  @Get(':userId/requests')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  public async findAllMembershipRequestsForUser(
    @Param('userId') userId: string,
    @Query() query: MembershipRequestsListOptions,
  ): Promise<PaginatedResult<TeamMembershipRequest>> {
    return await this.membershipsService.findAllMembershipRequestsForUser(userId, normalizePagination(query));
  }
}
