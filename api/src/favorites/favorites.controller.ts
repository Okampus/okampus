import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { User } from '../users/user.entity';
import type { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller({ path: 'favorites' })
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post(':contentId')
  public async add(
    @Param('contentId', ParseIntPipe) contentId: number,
    @CurrentUser() user: User,
  ): Promise<Favorite> {
    return await this.favoritesService.create(contentId, user);
  }

  @Get()
  public async findAllFavorites(
    @CurrentUser() user: User,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<Favorite>> {
    return await this.favoritesService.findAll(user, normalizePagination(query));
  }

  @Get(':contentId')
  public async findOne(
    @Param('contentId', ParseIntPipe) contentId: number,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Favorite | null> {
    const favorite = await this.favoritesService.findOne(contentId, user);
    res.status(favorite ? 200 : 204);
    return favorite;
  }

  @Delete(':contentId')
  public async remove(
    @Param('contentId', ParseIntPipe) contentId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.favoritesService.remove(contentId, user);
  }
}
