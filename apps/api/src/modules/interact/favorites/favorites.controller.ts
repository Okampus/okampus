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
import { FastifyReply } from 'fastify';
import { PaginationOptions } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import type { Content } from '@create/contents/entities/content.entity';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { User } from '@uaa/users/user.entity';
import type { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller({ path: 'favorites' })
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post(':id')
  public async add(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Content> {
    return await this.favoritesService.update(user, id, true);
  }

  @Get()
  public async findAllFavorites(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Query() query: PaginationOptions,
  ): Promise<PaginatedNodes<Favorite>> {
    return await this.favoritesService.findAll(user, id, query);
  }

  @Get(':id')
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<Favorite | null> {
    const favorite = await this.favoritesService.findOne(id, user);
    res.statusCode = favorite ? 200 : 204;
    return favorite;
  }

  @Delete(':id')
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Content> {
    return await this.favoritesService.update(user, id, false);
  }
}
