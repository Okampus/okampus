import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '../../posts/entities/post.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import { PostFavorite } from '../entities/post-favorite.entity';

@Injectable()
export class PostFavoritesService {
  constructor(
    @InjectRepository(PostFavorite) private readonly postFavoriteRepository: BaseRepository<PostFavorite>,
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
  ) {}

  public async create(postId: number, user: User): Promise<PostFavorite> {
    const post = await this.postRepository.findOneOrFail({ postId });

    const favorite = new PostFavorite(post, user);
    try {
      await this.postFavoriteRepository.persistAndFlush(favorite);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Post is already favorited');
      throw error;
    }
    return favorite;
  }

  public async findAll(user: User, paginationOptions?: PaginationOptions): Promise<PaginatedResult<PostFavorite>> {
    return await this.postFavoriteRepository.findWithPagination(
      paginationOptions,
      { user, kind: 'post' },
      { populate: ['post', 'post.tags', 'post.author'] },
    );
  }

  public async findOne(postId: number, user: User): Promise<PostFavorite> {
    return await this.postFavoriteRepository.findOneOrFail({ post: { postId }, user }, { populate: ['post', 'post.tags', 'post.author'] });
  }

  public async remove(postId: number, user: User): Promise<void> {
    const favorite = await this.postFavoriteRepository.findOneOrFail({ post: { postId }, user });
    await this.postFavoriteRepository.removeAndFlush(favorite);
  }
}
