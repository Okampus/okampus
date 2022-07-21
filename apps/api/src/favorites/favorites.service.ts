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

  // Public async create(id: number, user: User): Promise<Content> {
  //   const content = await this.contentRepository.findOneOrFail({ id }, { populate: ['parent'] });

  //   const ability = this.caslAbilityFactory.createForUser(user);
  //   assertPermissions(ability, Action.Interact, content);

  //   const favorite = new Favorite({ content, user });
  //   try {
  //     await this.favoriteRepository.persistAndFlush(favorite);
  //     content.favoriteCount++;
  //     await this.contentRepository.flush();
  //   } catch (error) {
  //     if (error instanceof UniqueConstraintViolationException)
  //       throw new BadRequestException('Content is already favorited');
  //     throw error;
  //   }
  //   return content;
  // }

  public async update(user: User, id: number, active: boolean): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail({ id }, ['lastEdit', 'author']);

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

  // Public async update(user: User, id: number, active: boolean): Promise<Favorite> {
  //   const content = await this.contentRepository.findOneOrFail({ id });

  //   const ability = this.caslAbilityFactory.createForUser(user);
  //   assertPermissions(ability, Action.Interact, content);

  //   const favorite = await this.favoriteRepository.findOneOrFail({ content, user });
  //   if (favorite.active !== active) {
  //     favorite.active = active;
  //     await this.favoriteRepository.flush();
  //   }

  //   return favorite;
  // }

  // public async remove(id: number, user: User): Promise<Content> {
  //   const favorite = await this.favoriteRepository.findOneOrFail({ content: { id }, user });

  //   const ability = this.caslAbilityFactory.createForUser(user);
  //   assertPermissions(ability, Action.Interact, favorite.content);

  //   favorite.active = false;
  //   await this.favoriteRepository.flush();
  //   // Await this.favoriteRepository.removeAndFlush(favorite);

  //   const content = await this.contentRepository.findOneOrFail({ id });
  //   content.favoriteCount--;
  //   await this.contentRepository.flush();
  //   return content;
  // }
}
