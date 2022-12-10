import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Content } from '@create/contents/entities/content.entity';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { User } from '@uaa/users/user.entity';
import { Favorite, PaginatedFavorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

@Resolver(() => Favorite)
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}

  // TODO: Add permission checks
  @Query(() => PaginatedFavorite)
  public async favoritesByUser(
    @CurrentUser() currentUser: User,
    @Args('id') id: string,
  ): Promise<PaginatedFavorite> {
    return await this.favoritesService.findAll(currentUser, id);
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
    return await this.favoritesService.update(user, id, active);
  }
}
