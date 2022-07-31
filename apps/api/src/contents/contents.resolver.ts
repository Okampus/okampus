import { BadRequestException, Inject } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateReportDto } from '../reports/dto/create-report.dto';
import { ReportsService } from '../reports/reports.service';
import { APP_PUB_SUB } from '../shared/lib/constants';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { ContentKind } from '../shared/lib/types/enums/content-kind.enum';
import { SubscriptionType } from '../shared/lib/types/enums/subscription-type.enum';
import { ContextBatchContents } from '../threads/threads.resolver';
import { User } from '../users/user.entity';
import { VotesService } from '../votes/votes.service';
import { ContentInteractions } from './content-interactions.model';
import { ContentsService } from './contents.service';
import { CreateContentWithKindDto } from './dto/create-content-with-kind.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, DEFAULT_INTERACTIONS } from './entities/content.entity';

@Resolver(() => Content)
export class ContentResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly contentsService: ContentsService,
    private readonly votesService: VotesService,
    private readonly favoritesService: FavoritesService,
    private readonly reportsService: ReportsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Content, { nullable: true })
  public async contentById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Content | null> {
    return await this.contentsService.findOne(user, id);
  }

  @ResolveField(() => [Content])
  public async children(
    @CurrentUser() user: User,
    @Parent() content: Content,
    @Context() batchContext: ContextBatchContents,
  ): Promise<Content[]> {
    if (batchContext.batchContents)
      return batchContext.batchContents?.[content.id] ?? [];

    const paginatedThreads = await this.contentsService.findAllChildren(user, content.id);
    return paginatedThreads.items;
  }

  @ResolveField(() => ContentInteractions)
  public async interactions(
    @CurrentUser() user: User,
    @Parent() content: Content,
    @Context() batchContext: ContextBatchContents,
  ): Promise<ContentInteractions> {
    if (batchContext.batchInteractions)
      return batchContext.batchInteractions[content.id] ?? DEFAULT_INTERACTIONS;
    return await this.contentsService.findInteractions(user, content.id);
  }

  // TODO: for future favorite caching in frontend, return both content and favorite in an array
  @Mutation(() => Content)
  public async reportContent(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('report') report: CreateReportDto,
  ): Promise<Content> {
    const updatedContent = await this.reportsService.create(user, id, report);
    await this.pubSub.publish(SubscriptionType.ReportAdded, { reportAdded: updatedContent });
    return updatedContent;
  }

  // TODO: for future favorite caching in frontend, return both content and favorite in an array
  @Mutation(() => Content)
  public async favoriteContent(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('favorite', { type: () => Boolean }) favorite: boolean,
  ): Promise<Content> {
    const updatedContent = await this.favoritesService.update(user, id, favorite);
    await this.pubSub.publish(SubscriptionType.FavoriteUpdated, { favoriteUpdated: updatedContent });
    return updatedContent;
  }

  // TODO: for future vote caching in frontend, return both content and vote in an array
  @Mutation(() => Content)
  public async voteContent(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('value', { type: () => Int }) vote: -1 | 0 | 1,
  ): Promise<Content> {
    const updatedContent = this.votesService.update(user, id, vote);
    await this.pubSub.publish(SubscriptionType.VoteUpdated, { voteUpdated: updatedContent });
    return updatedContent;
  }

  @Mutation(() => Content)
  public async addContent(
    @CurrentUser() user: User,
    @Args('child') child: CreateContentWithKindDto,
  ): Promise<Content> {
    if (child.contentKind === ContentKind.Post)
      throw new BadRequestException('Child content cannot be post');

    const parentContent = child.contentKind === ContentKind.Comment
      ? await this.contentsService.createComment(user, { ...child, isAnonymous: false })
      : await this.contentsService.createReply(user, { ...child, isAnonymous: false });

    await this.pubSub.publish(SubscriptionType.ContentAdded, { contentAdded: parentContent });
    return parentContent;
  }

  @Mutation(() => Content)
  public async updateContent(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('content') content: UpdateContentDto,
  ): Promise<Content> {
    const updatedContent = this.contentsService.update(user, id, content);
    await this.pubSub.publish(SubscriptionType.ContentUpdated, { contentUpdated: updatedContent });
    return updatedContent;
  }
}
