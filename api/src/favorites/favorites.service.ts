import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { User } from '../users/user.entity';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
  ) {}

  public async findAll(user: User, paginationOptions?: PaginationOptions): Promise<PaginatedResult<Favorite>> {
    return await this.favoriteRepository.findWithPagination(
      paginationOptions,
      { user },
      { populate: ['article', 'post.tags', 'post.author', 'reply.author', 'comment.author'] },
    );
  }
}
