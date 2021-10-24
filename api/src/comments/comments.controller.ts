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
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { VoteDto } from '../shared/dto/vote.dto';
import { CommentInterceptor } from '../shared/interceptors/comment.interceptor';
import { CommentsInterceptor } from '../shared/interceptors/comments.interceptor';
import { User } from '../users/user.schema';
import { CommentVotesService } from './comment-votes.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { Comment } from './schemas/comment.schema';

@UseGuards(JwtAuthGuard)
@Controller({ path: ['posts/:postId/comments', 'posts/comments'], version: '1' })
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentVotesService: CommentVotesService,
  ) {}

  @UseInterceptors(CommentInterceptor)
  @Post()
  public async create(
    @CurrentUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.create(user, postId, createCommentDto);
  }

  @UseInterceptors(CommentsInterceptor)
  @Get()
  public async findAll(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Comment[]> {
    return await this.commentsService.findAll(postId);
  }

  @UseInterceptors(CommentInterceptor)
  @Get(':id')
  public async findOne(@Param('id') commentId: string): Promise<Comment | null> {
    return await this.commentsService.findOne(commentId);
  }

  @UseInterceptors(CommentInterceptor)
  @Patch(':id')
  public async update(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.commentsService.update(user, commentId, updateCommentDto);
  }

  @Delete(':id')
  public async remove(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
  ): Promise<void> {
    await this.commentsService.remove(user, commentId);
  }

  @UseInterceptors(CommentInterceptor)
  @Post(':id/vote')
  public async vote(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() voteDto: VoteDto,
  ): Promise<Comment> {
    switch (voteDto.value) {
      case -1:
        return await this.commentVotesService.downvote(user, id);
      case 0:
        return await this.commentVotesService.neutralize(user, id);
      case 1:
        return await this.commentVotesService.upvote(user, id);
    }
  }
}
