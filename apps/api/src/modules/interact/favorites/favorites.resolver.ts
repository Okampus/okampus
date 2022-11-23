import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';
import { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

@Resolver(() => Favorite)
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}

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
    return await this.favoritesService.update(user, id, active);
  }
}
