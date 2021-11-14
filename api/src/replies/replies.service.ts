import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { User } from '../users/user.entity';
import type { CreateReplyDto } from './dto/create-reply.dto';
import type { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
  ) {}

  public async create(user: User, postId: number, createReplyDto: CreateReplyDto): Promise<Reply> {
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');
    if (post.locked)
      throw new ForbiddenException('Post locked');

    const reply = new Reply({ post, body: createReplyDto.body, author: user });
    await this.replyRepository.persistAndFlush(reply);
    return reply;
  }

  public async findAll(postId: number): Promise<Reply[]> {
    return await this.replyRepository.find({ post: { postId } });
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
      throw new ForbiddenException('Post locked');
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
    if (reply.post.locked)
      throw new ForbiddenException('Post locked');
    if (reply.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    await this.replyRepository.removeAndFlush(reply);
  }
}
