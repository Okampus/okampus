
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '@meta/shared/lib/constants';
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import { SubscriptionType } from '@meta/shared/lib/types/enums/subscription-type.enum';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';
import { Vote } from './vote.entity';
import { VotesService } from './votes.service';

@Resolver(() => Vote)
export class ReportsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly votesService: VotesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Vote])
  public async votesByUser(
    @CurrentUser() currentUser: User,
    @Args('id') id: string,
  ): Promise<Vote[]> {
    const paginatedReports = await this.votesService.findAll(currentUser, id);
    return paginatedReports.items;
  }

  @Query(() => Vote, { nullable: true })
  public async voteByContent(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Vote | null> {
    return await this.votesService.findOne(user, id);
  }

  // TODO: for future favorite caching in frontend, return both content and favorite in an array
  @Mutation(() => Content)
  public async createVote(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('value', { type: () => Int }) value: number,
  ): Promise<Content> {
    const updatedContent = await this.votesService.update(user, id, value as -1 | 0 | 1);
    await this.pubSub.publish(SubscriptionType.ReportAdded, { reportAdded: updatedContent });
    return updatedContent;
  }
}
