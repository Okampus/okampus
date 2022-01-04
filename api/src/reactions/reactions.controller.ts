import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post as PostRequest,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Article } from '../articles/entities/article.entity';
import { Post } from '../posts/entities/post.entity';
import { Reply } from '../replies/entities/reply.entity';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies, PoliciesGuard } from '../shared/modules/authorization';
import { User } from '../users/user.entity';
import { ReactArticleDto } from './dto/react-article.dto';
import { ReactPostDto } from './dto/react-post.dto';
import { ReactReplyDto } from './dto/react-reply.dto';
import type { ArticleReaction } from './entities/article-reaction.entity';
import type { PostReaction } from './entities/post-reaction.entity';
import type { ReplyReaction } from './entities/reply-reaction.entity';
import { ArticleReactionsService } from './services/article-reactions.service';
import { PostReactionsService } from './services/post-reactions.service';
import { ReplyReactionsService } from './services/reply-reactions.service';

@ApiTags('Reactions')
@UseGuards(PoliciesGuard)
@Controller({ path: 'reactions' })
export class ReactionsController {
  constructor(
    private readonly postReactionsService: PostReactionsService,
    private readonly replyReactionsService: ReplyReactionsService,
    private readonly articleReactionsService: ArticleReactionsService,
  ) {}

  @PostRequest('/posts/:postId')
  @CheckPolicies(ability => ability.can(Action.Interact, Post))
  public async addPostReaction(
    @CurrentUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() reactionDto: ReactPostDto,
  ): Promise<PostReaction> {
    return await this.postReactionsService.add(user, postId, reactionDto.reaction);
  }

  @Get('/posts/:postId')
  @CheckPolicies(ability => ability.can(Action.Read, Post))
  public async findAllPostReactions(@Param('postId', ParseIntPipe) postId: number): Promise<PostReaction[]> {
    return await this.postReactionsService.findAll(postId);
  }

  @Delete('/posts/:postId')
  @CheckPolicies(ability => ability.can(Action.Interact, Post))
  public async removePostReaction(
    @CurrentUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() reactionDto: ReactPostDto,
  ): Promise<void> {
    await this.postReactionsService.remove(user, postId, reactionDto.reaction);
  }

  @PostRequest('/replies/:replyId')
  @CheckPolicies(ability => ability.can(Action.Interact, Reply))
  public async addReplyReaction(
    @Param('replyId') replyId: string,
    @Body() reactReplyDto: ReactReplyDto,
    @CurrentUser() user: User,
  ): Promise<ReplyReaction> {
    return await this.replyReactionsService.add(user, replyId, reactReplyDto.reaction);
  }

  @Get('/replies/:replyId')
  @CheckPolicies(ability => ability.can(Action.Read, Reply))
  public async findAllReplyReactions(
    @Param('replyId') replyId: string,
  ): Promise<ReplyReaction[]> {
    return await this.replyReactionsService.findAll(replyId);
  }

  @Delete('/replies/:replyId')
  @CheckPolicies(ability => ability.can(Action.Delete, Reply))
  public async removeReplyReaction(
    @Param('replyId') replyId: string,
    @Body() reactReplyDto: ReactReplyDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.replyReactionsService.remove(user, replyId, reactReplyDto.reaction);
  }

  @PostRequest('articles/:articleId')
  @CheckPolicies(ability => ability.can(Action.Interact, Article))
  public async addReaction(
    @CurrentUser() user: User,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() reactionDto: ReactArticleDto,
  ): Promise<ArticleReaction> {
    return await this.articleReactionsService.add(user, articleId, reactionDto.reaction);
  }

  @Get('articles/:articleId')
  @CheckPolicies(ability => ability.can(Action.Read, Article))
  public async findReactions(@Param('articleId', ParseIntPipe) articleId: number): Promise<ArticleReaction[]> {
    return await this.articleReactionsService.findAll(articleId);
  }

  @Delete('articles/:articleId')
  @CheckPolicies(ability => ability.can(Action.Interact, Article))
  public async removeReaction(
    @CurrentUser() user: User,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() reactionDto: ReactArticleDto,
  ): Promise<void> {
    await this.articleReactionsService.remove(user, articleId, reactionDto.reaction);
  }
}
