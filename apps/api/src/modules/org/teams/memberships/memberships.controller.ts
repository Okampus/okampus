import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '@common/modules/authorization';
import type { PaginatedNodes } from '@common/modules/pagination';
import { User } from '@modules/uaa/users/user.entity';
import { ListMembershipRequestsDto } from '../dto/membership-requests-list-options.dto';
import type { TeamMember } from '../members/team-member.entity';
import type { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { TeamMembershipsService } from './memberships.service';

@ApiTags('Team Memberships')
@Controller()
export class TeamMembershipsController {
  constructor(
    private readonly membershipsService: TeamMembershipsService,
) {}

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  public async findOne(
    @Param('id') id: string,
  ): Promise<PaginatedNodes<TeamMember>> {
    return await this.membershipsService.findOne(id);
  }

  @Get(':id/requests')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  public async findAll(
    @Param('id') id: string,
    @Query() query: ListMembershipRequestsDto,
  ): Promise<PaginatedNodes<TeamMembershipRequest>> {
    return await this.membershipsService.findAll(id, query);
  }
}
