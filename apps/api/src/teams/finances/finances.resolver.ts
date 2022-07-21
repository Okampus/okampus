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
import { CreateTeamFinanceDto } from './dto/create-team-finance.dto';
import { TeamFinancesFilterDto } from './dto/list-team-finances.dto';
import { UpdateTeamFinanceDto } from './dto/update-team-finance.dto';
import { TeamFinancesService } from './finances.service';
import { TeamFinance } from './team-finance.entity';

@Resolver(() => TeamFinance)
export class TeamFinancesResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly teamFinancesService: TeamFinancesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => TeamFinance, { nullable: true })
  public async teamFinanceById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TeamFinance> {
    return await this.teamFinancesService.findOne(id);
  }

  @Query(() => [TeamFinance])
  public async teamFinances(
    @Args('filters') filters: TeamFinancesFilterDto,
  ): Promise<TeamFinance[]> {
    const paginatedTeamFinances = await this.teamFinancesService.findAll(filters);
    return paginatedTeamFinances.items;
  }

  @Mutation(() => TeamFinance)
  public async addTeamFinance(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('finance') finance: CreateTeamFinanceDto,
  ): Promise<TeamFinance> {
    const createdTeamFinance = await this.teamFinancesService.create(user, id, finance);
    await this.pubSub.publish(SubscriptionType.TeamFinanceAdded, { teamFinanceAdded: createdTeamFinance });
    return createdTeamFinance;
  }

  @Mutation(() => TeamFinance)
  public async updateTeamFinance(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('finance') finance: UpdateTeamFinanceDto,
  ): Promise<TeamFinance> {
    const updatedTeamFinance = await this.teamFinancesService.update(user, id, finance);
    await this.pubSub.publish(SubscriptionType.TeamFinanceUpdated, { teamFinanceUpdated: updatedTeamFinance });
    return updatedTeamFinance;
  }

  @Subscription(() => TeamFinance)
  public teamFinanceAdded(): AsyncIterator<TeamFinance> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamFinanceAdded);
  }

  @Subscription(() => TeamFinance)
  public teamFinanceUpdated(): AsyncIterator<TeamFinance> {
    return this.pubSub.asyncIterator(SubscriptionType.TeamFinanceUpdated);
  }
}
