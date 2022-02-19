import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(contentId: number, user: User): Promise<Favorite> {
    const content = await this.contentRepository.findOneOrFail({ contentId }, { populate: ['parent'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

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

  public async findAll(user: User, paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Favorite>> {
    const canSeeHiddenContent = this.caslAbilityFactory.canSeeHiddenContent(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { content: { isVisible: true } };
    return await this.favoriteRepository.findWithPagination(
      paginationOptions,
      { user, ...visibilityQuery },
      {
        populate: [
          'user',
          'content', 'content.author', 'content.parent',
          'content.contentMaster', 'content.contentMaster', 'content.contentMaster.tags',
        ],
        orderBy: { createdAt: 'DESC' },
      },
    );
  }

  public async findOne(contentId: number, user: User): Promise<Favorite | null> {
    const favorite = await this.favoriteRepository.findOne(
      { content: { contentId }, user },
      {
        populate: [
          'user',
          'content', 'content.author', 'content.parent',
          'content.contentMaster', 'content.contentMaster', 'content.contentMaster.tags',
        ],
      },
    );

    if (favorite) {
      const ability = this.caslAbilityFactory.createForUser(user);
      assertPermissions(ability, Action.Read, favorite.content);
    }

    return favorite;
  }

  public async remove(contentId: number, user: User): Promise<void> {
    const favorite = await this.favoriteRepository.findOneOrFail({ content: { contentId }, user });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, favorite.content);

    await this.favoriteRepository.removeAndFlush(favorite);
  }
}
