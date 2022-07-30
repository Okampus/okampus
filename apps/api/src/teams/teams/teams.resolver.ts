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
import { APP_PUB_SUB } from '../../shared/lib/constants';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { SubscriptionType } from '../../shared/lib/types/enums/subscription-type.enum';
import { User } from '../../users/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsFilterDto } from './dto/teams-filter.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
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
