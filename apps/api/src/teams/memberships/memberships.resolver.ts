import { Args, Query, Resolver } from '@nestjs/graphql';
import { FilterMembershipRequestsDto } from '../dto/membership-requests-list-options.dto';
import { TeamMember } from '../members/team-member.entity';
import { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { TeamMembershipsService } from './memberships.service';

@Resolver(() => TeamMembershipRequest)
export class TeamMembershipsResolver {
  constructor(
    private readonly teamMembershipService: TeamMembershipsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [TeamMember], { nullable: true })
  public async teamMembershipsByUserId(
    @Args('id') id: string,
  ): Promise<TeamMember[]> {
    const memberships = await this.teamMembershipService.findOne(id);
    return memberships.items;
  }

  @Query(() => [TeamMembershipRequest])
  public async teamMembershipRequestsByUserId(
    @Args('id') id: string,
    @Args('filters', { nullable: true }) filters?: FilterMembershipRequestsDto,
  ): Promise<TeamMembershipRequest[]> {
    const membershipRequests = await this.teamMembershipService.findAll(id, filters);
    return membershipRequests.items;
  }
}
