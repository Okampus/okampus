import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../comments/entities/comment.entity';
import type { User } from '../users/user.entity';
import type { CreateReplyDto } from './dto/create-reply.dto';
import type { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: EntityRepository<Comment>,
    @InjectRepository(Reply) private readonly replyRepository: EntityRepository<Reply>,
  ) {}

  public async create(user: User, commentId: string, createReplyDto: CreateReplyDto): Promise<Reply> {
    const comment = await this.commentRepository.findOne({ commentId });
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.post.locked)
      throw new ForbiddenException('Post locked');

    const reply = new Reply({
      body: createReplyDto.body,
      comment,
      post: comment.post,
      author: user,
    });
    await this.replyRepository.persistAndFlush(reply);
    return reply;
  }

  public async findAll(commentId: string): Promise<Reply[]> {
    return await this.replyRepository.find({ comment: { commentId } });
  }

  public async findOne(replyId: string): Promise<Reply | null> {
    const reply = await this.replyRepository.findOne({ replyId });
    if (!reply)
      throw new NotFoundException('Reply not found');
    return reply;
  }

  public async update(user: User, replyId: string, updateReplyDto: UpdateReplyDto): Promise<Reply> {
    const reply = await this.replyRepository.findOne({ replyId });
    if (!reply)
      throw new NotFoundException('Reply not found');
    if (reply.post.locked)
      throw new NotFoundException('Post locked');
    if (reply.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    wrap(reply).assign(updateReplyDto);
    await this.replyRepository.flush();
    return reply;
  }

  public async remove(user: User, replyId: string): Promise<void> {
    const reply = await this.replyRepository.findOne({ replyId });
    if (!reply)
      throw new NotFoundException('Reply not found');
    if (reply.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    await this.replyRepository.removeAndFlush(reply);
  }
}
