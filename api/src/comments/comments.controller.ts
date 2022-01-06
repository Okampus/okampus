import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies, PoliciesGuard } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { UpvoteDto } from '../shared/modules/vote/upvote.dto';
import { User } from '../users/user.entity';
import { CommentVotesService } from './comments-votes.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { CommentVote, NoCommentVote } from './entities/comment-vote.entity';
import { Comment } from './entities/comment.entity';

@ApiTags('Comments')
@UseGuards(PoliciesGuard)
@Controller({ path: ['posts'] })
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentVotesService: CommentVotesService,
  ) {}

  @Post(':postId/comments')
  @CheckPolicies(ability => ability.can(Action.Create, Comment))
  public async createUnderPost(
    @CurrentUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.createUnderPost(user, postId, createCommentDto);
  }

  @Post('replies/:replyId/comments')
  @CheckPolicies(ability => ability.can(Action.Create, Comment))
  public async createUnderReply(
    @CurrentUser() user: User,
    @Param('replyId') replyId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.createUnderReply(user, replyId, createCommentDto);
  }

  @Get(':postId/comments')
  @CheckPolicies(ability => ability.can(Action.Read, Comment))
  public async findAllUnderPost(
    @Query() query: PaginateDto,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PaginatedResult<Comment>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.commentsService.findAllUnderPost(postId, options);
    }
    return await this.commentsService.findAllUnderPost(postId);
  }

  @Get('replies/:replyId/comments')
  @CheckPolicies(ability => ability.can(Action.Read, Comment))
  public async findAllUnderReply(@Param('replyId') replyId: string): Promise<PaginatedResult<Comment>> {
    return await this.commentsService.findAllUnderReply(replyId);
  }

  @Get('replies/comments/:id')
  @CheckPolicies(ability => ability.can(Action.Read, Comment))
  public async findOne(@Param('id') commentId: string): Promise<Comment | null> {
    return await this.commentsService.findOne(commentId);
  }

  @Patch('replies/comments/:id')
  @CheckPolicies(ability => ability.can(Action.Update, Comment))
  public async update(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.update(user, commentId, updateCommentDto);
  }

  @Delete('replies/comments/:id')
  @CheckPolicies(ability => ability.can(Action.Delete, Comment))
  public async remove(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
  ): Promise<void> {
    await this.commentsService.remove(user, commentId);
  }

  @Get('replies/comments/:id/vote')
  @CheckPolicies(ability => ability.can(Action.Read, Comment))
  public async findVote(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<CommentVote | NoCommentVote> {
    return await this.commentVotesService.findVote(user, id);
  }

  @Post('replies/comments/:id/vote')
  @CheckPolicies(ability => ability.can(Action.Interact, Comment))
  public async vote(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() voteDto: UpvoteDto,
  ): Promise<Comment> {
    if (voteDto.value === 0)
      return await this.commentVotesService.neutralize(user, id);
    return await this.commentVotesService.upvote(user, id);
  }
}
