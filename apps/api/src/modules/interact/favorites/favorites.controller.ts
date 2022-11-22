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
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { normalizePagination, PaginateDto } from '@meta/shared/modules/pagination';
import type { PaginatedResult } from '@meta/shared/modules/pagination';
import type { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';
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
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<Favorite>> {
    return await this.favoritesService.findAll(user, id, normalizePagination(query));
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
