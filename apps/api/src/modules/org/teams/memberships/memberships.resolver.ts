import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListMembershipRequestsDto } from '@teams/dto/membership-requests-list-options.dto';
import { PaginatedTeamMember } from '@teams/members/team-member.entity';
import { PaginatedTeamMembershipRequest, TeamMembershipRequest } from '@teams/requests/team-membership-request.entity';
import { TeamMembershipsService } from './memberships.service';

@Resolver(() => TeamMembershipRequest)
export class TeamMembershipsResolver {
  constructor(
    private readonly teamMembershipService: TeamMembershipsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => PaginatedTeamMember, { nullable: true })
  public async teamMembershipsByUserId(
    @Args('id') id: string,
  ): Promise<PaginatedTeamMember> {
    return await this.teamMembershipService.findOne(id);
  }

  @Query(() => PaginatedTeamMembershipRequest)
  public async teamMembershipRequestsByUserId(
    @Args('id') id: string,
    @Args('filters', { nullable: true }) filters?: ListMembershipRequestsDto,
  ): Promise<PaginatedTeamMembershipRequest> {
    return await this.teamMembershipService.findAll(id, filters);
  }
}
