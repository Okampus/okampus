import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Comment } from '../../comments/entities/comment.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import { CommentFavorite } from '../entities/comment-favorite.entity';

@Injectable()
export class CommentFavoritesService {
  constructor(
    @InjectRepository(CommentFavorite) private readonly commentFavoriteRepository: BaseRepository<CommentFavorite>,
    @InjectRepository(Comment) private readonly commentRepository: BaseRepository<Comment>,
  ) {}

  public async create(commentId: string, user: User): Promise<CommentFavorite> {
    const comment = await this.commentRepository.findOneOrFail({ commentId });

    const favorite = new CommentFavorite(comment, user);
    try {
      await this.commentFavoriteRepository.persistAndFlush(favorite);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Comment is already favorited');
      throw error;
    }
    return favorite;
  }

  public async findAll(user: User, paginationOptions?: PaginationOptions): Promise<PaginatedResult<CommentFavorite>> {
    return await this.commentFavoriteRepository.findWithPagination(
      paginationOptions,
      { user, kind: 'comment' },
      { populate: ['comment', 'comment.author', 'comment.post', 'comment.reply'] },
    );
  }

  public async findOne(commentId: string, user: User): Promise<CommentFavorite> {
    return await this.commentFavoriteRepository.findOneOrFail(
      { comment: { commentId }, user },
      { populate: ['comment', 'comment.author', 'comment.post', 'comment.reply'] },
    );
  }

  public async remove(commentId: string, user: User): Promise<void> {
    const favorite = await this.commentFavoriteRepository.findOneOrFail({ comment: { commentId }, user });
    await this.commentFavoriteRepository.removeAndFlush(favorite);
  }
}
