import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies, PoliciesGuard } from '../shared/modules/authorization';
import { VoteDto } from '../shared/modules/vote/vote.dto';
import { User } from '../users/user.entity';
import { CommentVotesService } from './comments-votes.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiTags('Comments')
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller({
  path: [
    'posts/replies/:replyId/comments',
    'posts/replies/comments',
  ],
})
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentVotesService: CommentVotesService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Comment))
  public async create(
    @CurrentUser() user: User,
    @Param('replyId') replyId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.create(user, replyId, createCommentDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Comment))
  public async findAll(@Param('replyId') replyId: string): Promise<Comment[]> {
    return await this.commentsService.findAll(replyId);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Comment))
  public async findOne(@Param('id') commentId: string): Promise<Comment | null> {
    return await this.commentsService.findOne(commentId);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Comment))
  public async update(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.update(user, commentId, updateCommentDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Comment))
  public async remove(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
  ): Promise<void> {
    await this.commentsService.remove(user, commentId);
  }

  @Post(':id/vote')
  @CheckPolicies(ability => ability.can(Action.Interact, Comment))
  public async vote(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() voteDto: VoteDto,
  ): Promise<Comment> {
    if (voteDto.value === 0)
      return await this.commentVotesService.neutralize(user, id);
    return await this.commentVotesService.update(user, id, voteDto.value);
  }
}
