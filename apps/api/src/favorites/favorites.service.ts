import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import type { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async update(user: User, id: number, active: boolean): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ id }, { populate: ['lastEdit', 'author'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    let favorite = await this.favoriteRepository.findOne({ content, user });
    const previouslyActive = favorite?.active ?? null;
    if (favorite && previouslyActive === active)
      return content;

    // Update pivot table
    if (favorite)
      favorite.active = active;
    else if (active)
      favorite = new Favorite({ content, user });
    else
      return content;

    await this.favoriteRepository.persistAndFlush(favorite);

    content.favoriteCount += active ? 1 : -1;

    await this.contentRepository.flush();
    return content;
  }

  public async findAll(user: User, paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Favorite>> {
    const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
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

  public async findOne(id: number, user: User): Promise<Favorite | null> {
    const favorite = await this.favoriteRepository.findOne(
      { content: { id }, user },
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
}
