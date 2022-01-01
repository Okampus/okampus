import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies, PoliciesGuard } from '../shared/modules/authorization';
import { UpvoteDto } from '../shared/modules/vote/upvote.dto';
import { User } from '../users/user.entity';
import { CommentVotesService } from './comments-votes.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiTags('Comments')
@UseGuards(JwtAuthGuard, PoliciesGuard)
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
  public async findAllUnderPost(@Param('postId', ParseIntPipe) postId: number): Promise<Comment[]> {
    return await this.commentsService.findAllUnderPost(postId);
  }

  @Get('replies/:replyId/comments')
  @CheckPolicies(ability => ability.can(Action.Read, Comment))
  public async findAllUnderReply(@Param('replyId') replyId: string): Promise<Comment[]> {
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
