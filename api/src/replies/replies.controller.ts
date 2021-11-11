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
import { VoteDto } from '../shared/modules/vote/vote.dto';
import { User } from '../users/user.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import type { Reply } from './entities/reply.entity';
import { ReplyVotesService } from './replies-votes.service';
import { RepliesService } from './replies.service';

@ApiTags('Replies')
@UseGuards(JwtAuthGuard)
@Controller({
  path: [
    'posts/comments/:commentId/replies',
    'posts/comments/replies',
  ],
})
export class RepliesController {
  constructor(
    private readonly repliesService: RepliesService,
    private readonly replyVotesService: ReplyVotesService,
  ) {}

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Param('commentId') commentId: string,
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<Reply> {
    return await this.repliesService.create(user, commentId, createReplyDto);
  }

  @Get()
  public async findAll(@Param('commentId') commentId: string): Promise<Reply[]> {
    return await this.repliesService.findAll(commentId);
  }

  @Get(':id')
  public async findOne(@Param('id') replyId: string): Promise<Reply | null> {
    return await this.repliesService.findOne(replyId);
  }

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

  @Post(':id/vote')
  public async vote(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() voteDto: VoteDto,
  ): Promise<Reply> {
    if (voteDto.value === 0)
      return await this.replyVotesService.neutralize(user, id);
    return await this.replyVotesService.update(user, id, voteDto.value);
  }
}
