import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../contents/content.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
  ) {}

  public async create(contentId: number, user: User): Promise<Favorite> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const favorite = new Favorite({ content, user });
    try {
      await this.favoriteRepository.persistAndFlush(favorite);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Content is already favorited');
      throw error;
    }
    return favorite;
  }

  public async findAll(user: User, paginationOptions?: PaginationOptions): Promise<PaginatedResult<Favorite>> {
    return await this.favoriteRepository.findWithPagination(
      paginationOptions,
      { user },
      {
        populate: [
          'user',
          'content', 'content.author',
          'content.contentMaster', 'content.contentMaster', 'content.contentMaster.tags',
        ],
      },
    );
  }

  public async findOne(contentId: number, user: User): Promise<Favorite | null> {
    const favorite = await this.favoriteRepository.findOne(
      { content: { contentId }, user },
      {
        populate: [
          'user',
          'content', 'content.author',
          'content.contentMaster', 'content.contentMaster', 'content.contentMaster.tags',
        ],
      },
    );
    return favorite;
  }

  public async remove(contentId: number, user: User): Promise<void> {
    const favorite = await this.favoriteRepository.findOneOrFail({ content: { contentId }, user });
    await this.favoriteRepository.removeAndFlush(favorite);
  }
}
