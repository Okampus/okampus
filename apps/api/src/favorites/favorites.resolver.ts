
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { Content } from '../contents/entities/content.entity';
import { APP_PUB_SUB } from '../shared/lib/constants';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { SubscriptionType } from '../shared/lib/types/enums/subscription-type.enum';
import { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

@Resolver(() => Favorite)
export class ReportsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly favoritesService: FavoritesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Favorite])
  public async favoritesByUser(
    @CurrentUser() currentUser: User,
    @Args('id') id: string,
  ): Promise<Favorite[]> {
    const paginatedReports = await this.favoritesService.findAll(currentUser, id);
    return paginatedReports.items;
  }

  @Query(() => Favorite)
  public async favoriteByContent(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Favorite> {
    return await this.favoritesService.findOne(id, user);
  }

  // TODO: for future favorite caching in frontend, return both content and favorite in an array
  @Mutation(() => Content)
  public async createFavorite(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('active', { type: () => Boolean }) active: boolean,
  ): Promise<Content> {
    const updatedContent = await this.favoritesService.update(user, id, active);
    await this.pubSub.publish(SubscriptionType.ReportAdded, { reportAdded: updatedContent });
    return updatedContent;
  }
}
