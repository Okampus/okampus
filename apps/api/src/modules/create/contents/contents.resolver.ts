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
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Interactions } from '@modules/create/contents/interactions.model';
import { FavoritesService } from '@modules/interact/favorites/favorites.service';
import { VotesService } from '@modules/interact/votes/votes.service';
import { User } from '@modules/uaa/users/user.entity';
import { ContextBatchContents } from '../threads/threads.resolver';
import { ContentsService } from './contents.service';
import { CreateContentWithKindDto } from './dto/create-content-with-kind.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, DEFAULT_INTERACTIONS } from './entities/content.entity';

@Resolver(() => Content)
export class ContentResolver {
  constructor(
    private readonly contentsService: ContentsService,
    private readonly votesService: VotesService,
    private readonly favoritesService: FavoritesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Content, { nullable: true })
  public async contentById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Content | null> {
    return this.contentsService.findOne(user, id);
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

  @ResolveField(() => Interactions)
  public async interactions(
    @CurrentUser() user: User,
    @Parent() content: Content,
    @Context() batchContext: ContextBatchContents,
  ): Promise<Interactions> {
    if (batchContext.batchInteractions)
      return batchContext.batchInteractions[content.id] ?? { ...DEFAULT_INTERACTIONS };
    return this.contentsService.findInteractions(user, content.id);
  }

  @Mutation(() => Content)
  public async createContent(
    @CurrentUser() user: User,
    @Args('child') child: CreateContentWithKindDto,
  ): Promise<Content> {
    return this.contentsService.createContentWithKind(user, child);
  }

  @Mutation(() => Content)
  public async updateContent(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('content') content: UpdateContentDto,
  ): Promise<Content> {
    return this.contentsService.update(user, id, content);
  }
}
