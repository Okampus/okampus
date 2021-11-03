import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '../users/user.entity';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: EntityRepository<Post>,
  ) {}

  public async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post({ ...createPostDto, author: user });
    await this.postRepository.persistAndFlush(post);
    return post;
  }

  public async findAll(
    paginationOptions?: { offset: number; limit: number },
  ): Promise<{ items: Post[]; total: number }> {
    const [items, total] = await this.postRepository.findAndCount({}, paginationOptions);
    return { items, total };
  }

  public async findOne(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');
    return post;
  }

  public async update(user: User, postId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');
    if (post.locked) {
      // Even if the post is locked, we can still unlock it.
      if (updatePostDto?.locked === false)
        updatePostDto = { locked: false };
      else
        throw new ForbiddenException('Post locked');
    }
    if (post.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    wrap(post).assign(updatePostDto);
    await this.postRepository.flush();
    return post;
  }

  public async remove(user: User, postId: number): Promise<void> {
    const post = await this.postRepository.findOne({ postId });
    if (!post)
      throw new NotFoundException('Post not found');
    if (post.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    await this.postRepository.removeAndFlush(post);
  }
}
