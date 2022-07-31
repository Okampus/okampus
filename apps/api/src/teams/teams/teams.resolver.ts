import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '../../shared/lib/constants';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { SubscriptionType } from '../../shared/lib/types/enums/subscription-type.enum';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';
import { User } from '../../users/user.entity';
import { MembershipRequestState } from '../types/membership-request-state.enum';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsFilterDto } from './dto/teams-filter.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamMembershipStatus } from './team-membership-status.model';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

export interface ContextMemberships {
  membershipStates: Record<number, TeamMembershipStatus>;
}
@Resolver(() => Team)
export class TeamsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly teamsService: TeamsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Team, { nullable: true })
  public async teamById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Team> {
    return await this.teamsService.findOne(id);
  }

  @Query(() => [Team])
  public async teams(
    @Args('filters', { nullable: true }) filters?: TeamsFilterDto,
  ): Promise<Team[]> {
    const paginatedTeams = await this.teamsService.findAll(filters ?? {});
    return paginatedTeams.items;
  }

  @Query(() => [Team])
  public async clubs(@CurrentUser() user: User, @Context() membershipContext: ContextMemberships): Promise<Team[]> {
    await this.userRepository.populate(user, ['teamMembershipRequests', 'teamMemberships']);

    const DEFAULT_MEMBERSHIP = { membership: null, requestStatus: null };

    membershipContext.membershipStates = {} as Record<number, TeamMembershipStatus>;

    const getOrCreate = (id: number): TeamMembershipStatus => {
      if (!membershipContext.membershipStates[id])
        membershipContext.membershipStates[id] = { ...DEFAULT_MEMBERSHIP };

      return membershipContext.membershipStates[id];
    };

    for (const membership of await user.teamMemberships.loadItems())
      getOrCreate(membership.team.id).membership = membership;


    for (const request of await user.teamMembershipRequests.loadItems()) {
        const teamMembershipStatus = getOrCreate(request.team.id);
        if (teamMembershipStatus.requestStatus !== MembershipRequestState.Approved)
          teamMembershipStatus.requestStatus = request.state === MembershipRequestState.Rejected ? null : request.state;
    }

    const paginatedTeams = await this.teamsService.findAll({ kind: TeamKind.Club });
    for (const club of paginatedTeams.items) {
        if (!(club.id in membershipContext.membershipStates))
          membershipContext.membershipStates[club.id] = DEFAULT_MEMBERSHIP;
    }

    return paginatedTeams.items;
  }

  @ResolveField(() => TeamMembershipStatus, { nullable: true })
  public async userMembership(
    @CurrentUser() user: User,
    @Parent() team: Team,
    @Context() membershipContext: ContextMemberships,
  ): Promise<TeamMembershipStatus> {
    if (membershipContext.membershipStates)
      return membershipContext.membershipStates[team.id];

    await this.userRepository.populate(user, ['teamMembershipRequests', 'teamMemberships']);
    const memberships = await user.teamMemberships.loadItems();
    const requests = await user.teamMembershipRequests.loadItems();

    let requestStatus = null;
    if (requests.some(request => request.state === MembershipRequestState.Approved))
      requestStatus = MembershipRequestState.Approved;
    else if (requests.some(request => request.state === MembershipRequestState.Pending))
      requestStatus = MembershipRequestState.Pending;

    return {
      membership: memberships.find(membership => membership.team.id === team.id) ?? null,
      requestStatus,
    };
  }

  @Mutation(() => Team)
  public async addTeam(
    @CurrentUser() user: User,
    @Args('team') team: CreateTeamDto,
  ): Promise<Team> {
    const createdTeam = await this.teamsService.create(user, team);
    await this.pubSub.publish(SubscriptionType.TeamAdded, { teamAdded: createdTeam });
    return createdTeam;
  }

  @Mutation(() => Team)
  public async updateTeam(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('team') team: UpdateTeamDto,
  ): Promise<Team> {
    const updatedTeam = await this.teamsService.update(user, id, team);
    await this.pubSub.publish(SubscriptionType.TeamUpdated, { teamUpdated: updatedTeam });
    return updatedTeam;
  }

  @Subscription(() => Team)
  public teamAdded(): AsyncIterator<Team> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamAdded);
  }

  @Subscription(() => Team)
  public teamUpdated(): AsyncIterator<Team> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamUpdated);
  }
}
