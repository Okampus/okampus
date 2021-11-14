import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reply } from '../replies/entities/reply.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { User } from '../users/user.entity';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    @InjectRepository(Comment) private readonly commentRepository: BaseRepository<Comment>,
  ) {}

  public async create(user: User, replyId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const reply = await this.replyRepository.findOne({ replyId });
    if (!reply)
      throw new NotFoundException('Reply not found');
    if (reply.post.locked)
      throw new ForbiddenException('Post locked');

    const comment = new Comment({
      body: createCommentDto.body,
      reply,
      post: reply.post,
      author: user,
    });
    await this.commentRepository.persistAndFlush(comment);
    return comment;
  }

  public async findAll(replyId: string): Promise<Comment[]> {
    return await this.commentRepository.find({ reply: { replyId } });
  }

  public async findOne(commentId: string): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({ commentId });
    if (!comment)
      throw new NotFoundException('Comment not found');
    return comment;
  }

  public async update(user: User, commentId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ commentId });
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.post.locked)
      throw new ForbiddenException('Post locked');
    if (comment.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    wrap(comment).assign(updateCommentDto);
    await this.commentRepository.flush();
    return comment;
  }

  public async remove(user: User, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ commentId });
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    await this.commentRepository.removeAndFlush(comment);
  }
}
