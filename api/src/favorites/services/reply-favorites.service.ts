import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Reply } from '../../replies/entities/reply.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import { ReplyFavorite } from '../entities/reply-favorite.entity';

@Injectable()
export class ReplyFavoritesService {
  constructor(
    @InjectRepository(ReplyFavorite) private readonly replyFavoriteRepository: BaseRepository<ReplyFavorite>,
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
  ) {}

  public async create(replyId: string, user: User): Promise<ReplyFavorite> {
    const reply = await this.replyRepository.findOneOrFail({ replyId });

    const favorite = new ReplyFavorite(reply, user);
    try {
      await this.replyFavoriteRepository.persistAndFlush(favorite);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Reply is already favorited');
      throw error;
    }
    return favorite;
  }

  public async findAll(user: User, paginationOptions?: PaginationOptions): Promise<PaginatedResult<ReplyFavorite>> {
    return await this.replyFavoriteRepository.findWithPagination(
      paginationOptions,
      { user, kind: 'reply' },
      { populate: ['reply', 'reply.post', 'reply.author'] },
    );
  }

  public async findOne(replyId: string, user: User): Promise<ReplyFavorite> {
    return await this.replyFavoriteRepository.findOneOrFail({ reply: { replyId }, user }, { populate: ['reply', 'reply.post', 'reply.author'] });
  }

  public async remove(replyId: string, user: User): Promise<void> {
    const favorite = await this.replyFavoriteRepository.findOneOrFail({ reply: { replyId }, user });
    await this.replyFavoriteRepository.removeAndFlush(favorite);
  }
}
