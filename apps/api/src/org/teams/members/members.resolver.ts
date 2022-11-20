import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '../../../shared/lib/constants';
import { CurrentUser } from '../../../shared/lib/decorators/current-user.decorator';
import { SubscriptionType } from '../../../shared/lib/types/enums/subscription-type.enum';
import { User } from '../../../uua/users/user.entity';
import type { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMembersService } from './members.service';
import { TeamMember } from './team-member.entity';

@Resolver(() => TeamMember)
export class TeamMembersResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly teamMembersService: TeamMembersService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [TeamMember], { nullable: true })
  public async teamMembers(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TeamMember[]> {
    const memberships = await this.teamMembersService.findAllMembers(id);
    return memberships.items;
  }

  @Mutation(() => TeamMember)
  public async addUserToTeam(
    @CurrentUser() user: User,
    @Args('teamId', { type: () => Int }) teamId: number,
    @Args('userId', { type: () => Int }) userId: string,
    @Args('invite') invite: InviteMemberDto,
  ): Promise<TeamMembershipRequest> {
    const createdRequest = await this.teamMembersService.inviteUser(user, teamId, userId, invite);
    await this.pubSub.publish(SubscriptionType.TeamMemberInvited, { teamMemberAdded: createdRequest });
    return createdRequest;
  }

  @Mutation(() => TeamMember)
  public async updateTeamMember(
    @CurrentUser() user: User,
    @Args('teamId', { type: () => Int }) teamId: number,
    @Args('userId', { type: () => Int }) userId: string,
    @Args('update') update: UpdateTeamMemberDto,
  ): Promise<TeamMember> {
    const updatedMember = await this.teamMembersService.updateMember(user, teamId, userId, update);
    await this.pubSub.publish(SubscriptionType.TeamMemberUpdated, { teamMemberUpdated: updatedMember });
    return updatedMember;
  }

  @Mutation(() => TeamMember, { nullable: true })
  public async removeTeamMember(
    @CurrentUser() user: User,
    @Args('teamId', { type: () => Int }) teamId: number,
    @Args('userId', { type: () => Int }) userId: string,
  ): Promise<void> {
    await this.teamMembersService.removeMember(user, teamId, userId);
    await this.pubSub.publish(SubscriptionType.TeamMemberUpdated, { teamMemberRemoved: user });
  }

  @Subscription(() => TeamMember)
  public teamMemberInvited(): AsyncIterator<TeamMember> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamMemberInvited);
  }

  @Subscription(() => TeamMember)
  public teamMemberUpdated(): AsyncIterator<TeamMember> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamMemberUpdated);
  }
}
