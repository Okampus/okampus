import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';
import type { User } from '../users/user.entity';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: EntityRepository<Post>,
    @InjectRepository(Comment) private readonly commentRepository: EntityRepository<Comment>,
  ) {}

  public async create(user: User, postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');
    if (post.locked)
      throw new ForbiddenException('Post locked');

    const comment = new Comment({ post, body: createCommentDto.body, author: user });
    await this.commentRepository.persistAndFlush(comment);
    return comment;
  }

  public async findAll(postId: number): Promise<Comment[]> {
    return await this.commentRepository.find({ post: { postId } });
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
    if (comment.post.locked)
      throw new ForbiddenException('Post locked');
    if (comment.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    await this.commentRepository.removeAndFlush(comment);
  }
}
