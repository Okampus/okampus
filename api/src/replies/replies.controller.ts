import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { VoteDto } from '../shared/dto/vote.dto';
import { UserResponseInterceptor } from '../shared/interceptors/user-response.interceptor';
import { UserResponsesInterceptor } from '../shared/interceptors/user-responses.interceptor';
import { User } from '../users/user.schema';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { ReplyVotesService } from './replies-votes.service';
import { RepliesService } from './replies.service';
import type { Reply } from './schemas/reply.schema';

@UseGuards(JwtAuthGuard)
@Controller({
  path: [
    'posts/:postId/comments/:commentId/replies',
    'posts/:postId/comments/replies',
    'posts/comments/:commentId/replies',
    'posts/comments/replies',
    'posts/replies',
  ],
  version: '1',
})
export class RepliesController {
  constructor(
    private readonly repliesService: RepliesService,
    private readonly replyVotesService: ReplyVotesService,
  ) {}

  @UseInterceptors(UserResponseInterceptor)
  @Post()
  public async create(
    @CurrentUser() user: User,
    @Param('commentId') commentId: string,
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<Reply> {
    return await this.repliesService.create(user, commentId, createReplyDto);
  }

  @UseInterceptors(UserResponsesInterceptor)
  @Get()
  public async findAll(@Param('commentId') commentId: string): Promise<Reply[]> {
    return await this.repliesService.findAll(commentId);
  }

  @UseInterceptors(UserResponseInterceptor)
  @Get(':id')
  public async findOne(@Param('id') replyId: string): Promise<Reply | null> {
    return await this.repliesService.findOne(replyId);
  }

  @UseInterceptors(UserResponseInterceptor)
  @Patch(':id')
  public async update(
    @CurrentUser() user: User,
    @Param('id') replyId: string,
    @Body() updateReplyDto: UpdateReplyDto,
  ): Promise<Reply> {
    return await this.repliesService.update(user, replyId, updateReplyDto);
  }

  @Delete(':id')
  public async remove(
    @CurrentUser() user: User,
    @Param('id') replyId: string,
  ): Promise<void> {
    await this.repliesService.remove(user, replyId);
  }

  @UseInterceptors(UserResponseInterceptor)
  @Post(':id/vote')
  public async vote(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() voteDto: VoteDto,
  ): Promise<Reply> {
    switch (voteDto.value) {
      case -1:
        return await this.replyVotesService.downvote(user, id);
      case 0:
        return await this.replyVotesService.neutralize(user, id);
      case 1:
        return await this.replyVotesService.upvote(user, id);
    }
  }
}
