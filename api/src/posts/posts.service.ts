import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { Tag } from '../tags/tag.entity';
import type { User } from '../users/user.entity';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
  ) {}

  public async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post({ ...createPostDto, author: user });
    const tags = await this.tagRepository.find({ name: { $in: createPostDto.tags } });
    post.tags.add(...tags);
    await this.postRepository.persistAndFlush(post);
    return post;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Post>> {
    return await this.postRepository.findWithPagination(paginationOptions, {}, { populate: ['tags'] });
  }

  public async findOne(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({ postId }, ['tags']);
    if (!post)
      throw new NotFoundException('Post not found');
    return post;
  }

  public async update(user: User, postId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ postId }, ['tags']);
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

    const { tags: wantedTags, ...updatedProps } = updatePostDto;

    if (wantedTags) {
      if (wantedTags.length === 0) {
        post.tags.removeAll();
      } else {
        const tags = await this.tagRepository.find({ name: { $in: wantedTags } });
        post.tags.set(tags);
      }
    }

    if (updatedProps)
      wrap(post).assign(updatedProps);

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
