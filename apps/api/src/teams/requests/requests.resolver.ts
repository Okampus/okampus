import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '../../shared/lib/constants';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { SubscriptionType } from '../../shared/lib/types/enums/subscription-type.enum';
import { User } from '../../users/user.entity';
import { FilterMembershipRequestsDto } from '../dto/membership-requests-list-options.dto';
import { CreateTeamMembershipRequestDto } from './dto/create-membership-request.dto';
import { PutTeamMembershipRequestDto } from './dto/put-membership-request.dto';
import { UpdateTeamMembershipRequestDto } from './dto/update-membership-request.dto';
import { TeamMembershipRequestsService } from './requests.service';
import { TeamMembershipRequest } from './team-membership-request.entity';

@Resolver(() => TeamMembershipRequest)
export class TeamMembershipRequestsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly teamMembershipRequestsService: TeamMembershipRequestsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [TeamMembershipRequest], { nullable: true })
  public async getTeamMembershipRequests(
    @Args('id') id: number,
    @Args('filter', { nullable: true }) filter?: FilterMembershipRequestsDto,
  ): Promise<TeamMembershipRequest[]> {
    const requests = await this.teamMembershipRequestsService.findAll(id, filter);
    return requests.items;
  }

  @Mutation(() => TeamMembershipRequest)
  public async joinTeam(
    @CurrentUser() user: User,
    @Args('id') id: number,
    @Args('request') request: CreateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    const createdRequest = this.teamMembershipRequestsService.create(user, id, request);
    await this.pubSub.publish(SubscriptionType.TeamMembershipRequestAdded, { teamMemberAdded: createdRequest });
    return createdRequest;
  }

  @Mutation(() => TeamMembershipRequest)
  public async updateTeamMembershipRequest(
    @CurrentUser() user: User,
    @Args('requestId') requestId: number,
    @Args('update') update: UpdateTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    const request = await this.teamMembershipRequestsService.update(user, requestId, update);
    await this.pubSub.publish(SubscriptionType.TeamMembershipRequestUpdated, { teamMembershipRequestUpdated: request });
    return request;
  }

  @Mutation(() => TeamMembershipRequest)
  public async handleTeamMembershipRequest(
    @CurrentUser() user: User,
    @Args('requestId') requestId: number,
    @Args('payload') payload: PutTeamMembershipRequestDto,
  ): Promise<TeamMembershipRequest> {
    const request = await this.teamMembershipRequestsService.handleRequest(user, requestId, payload);
    await this.pubSub.publish(SubscriptionType.TeamMembershipRequestUpdated, { teamMembershipRequestUpdated: request });
    return request;
  }

  @Subscription(() => TeamMembershipRequest)
  public teamMembershipRequestAdded(): AsyncIterator<TeamMembershipRequest> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamMembershipRequestAdded);
  }

  @Subscription(() => TeamMembershipRequest)
  public teamMembershipRequestUpdated(): AsyncIterator<TeamMembershipRequest> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamMembershipRequestUpdated);
  }
}
