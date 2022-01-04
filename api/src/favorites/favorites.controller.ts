import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { PoliciesGuard } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { User } from '../users/user.entity';
import type { ArticleFavorite } from './entities/article-favorite.entity';
import type { CommentFavorite } from './entities/comment-favorite.entity';
import type { Favorite } from './entities/favorite.entity';
import type { PostFavorite } from './entities/post-favorite.entity';
import type { ReplyFavorite } from './entities/reply-favorite.entity';
import { FavoritesService } from './favorites.service';
import { ArticleFavoritesService } from './services/article-favorites.service';
import { CommentFavoritesService } from './services/comment-favorites.service';
import { PostFavoritesService } from './services/post-favorites.service';
import { ReplyFavoritesService } from './services/reply-favorites.service';

@ApiTags('Favorites')
@UseGuards(PoliciesGuard)
@Controller({ path: 'favorites' })
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly postFavoritesService: PostFavoritesService,
    private readonly replyFavoritesService: ReplyFavoritesService,
    private readonly commentFavoritesService: CommentFavoritesService,
    private readonly articleFavoritesService: ArticleFavoritesService,
  ) {}

  @Get()
  public async findAllFavorites(
    @Query() query: PaginateDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResult<Favorite>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.favoritesService.findAll(user, options);
    }
    return await this.favoritesService.findAll(user);
  }

  @Post('posts/:postId')
  public async addPostFavorite(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: User,
  ): Promise<PostFavorite> {
    return await this.postFavoritesService.create(postId, user);
  }

  @Get('posts')
  public async findAllPostFavorites(
    @Query() query: PaginateDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResult<PostFavorite>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.postFavoritesService.findAll(user, options);
    }
    return await this.postFavoritesService.findAll(user);
  }

  @Get('posts/:postId')
  public async findOnePostFavorite(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: User,
  ): Promise<PostFavorite | null> {
    return await this.postFavoritesService.findOne(postId, user);
  }

  @Delete('posts/:postId')
  public async removePostFavorite(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.postFavoritesService.remove(postId, user);
  }

  @Post('replies/:replyId')
  public async createReplyFavorite(
    @Param('replyId') replyId: string,
    @CurrentUser() user: User,
  ): Promise<ReplyFavorite> {
    return await this.replyFavoritesService.create(replyId, user);
  }

  @Get('replies')
  public async findAllReplyFavorites(
    @Query() query: PaginateDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResult<ReplyFavorite>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.replyFavoritesService.findAll(user, options);
    }
    return await this.replyFavoritesService.findAll(user);
  }

  @Get('replies/:replyId')
  public async findOneReplyFavorite(
    @Param('replyId') replyId: string,
    @CurrentUser() user: User,
  ): Promise<ReplyFavorite | null> {
    return await this.replyFavoritesService.findOne(replyId, user);
  }

  @Delete('replies/:replyId')
  public async removeReplyFavorite(
    @Param('replyId') replyId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.replyFavoritesService.remove(replyId, user);
  }

  @Post('comments/:commentId')
  public async createCommentFavorite(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<CommentFavorite> {
    return await this.commentFavoritesService.create(commentId, user);
  }

  @Get('comments')
  public async findAllCommentFavorites(
    @Query() query: PaginateDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResult<CommentFavorite>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.commentFavoritesService.findAll(user, options);
    }
    return await this.commentFavoritesService.findAll(user);
  }

  @Get('comments/:commentId')
  public async findOneCommentFavorite(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<CommentFavorite | null> {
    return await this.commentFavoritesService.findOne(commentId, user);
  }

  @Delete('comments/:commentId')
  public async removeCommentFavorite(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.commentFavoritesService.remove(commentId, user);
  }

  @Post('articles/:articleId')
  public async addArticleFavorite(
    @Param('articleId', ParseIntPipe) articleId: number,
    @CurrentUser() user: User,
  ): Promise<ArticleFavorite> {
    return await this.articleFavoritesService.create(articleId, user);
  }

  @Get('articles')
  public async findAllArticleFavorites(
    @Query() query: PaginateDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResult<ArticleFavorite>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.articleFavoritesService.findAll(user, options);
    }
    return await this.articleFavoritesService.findAll(user);
  }

  @Get('articles/:articleId')
  public async findOneArticleFavorite(
    @Param('articleId', ParseIntPipe) articleId: number,
    @CurrentUser() user: User,
  ): Promise<ArticleFavorite | null> {
    return await this.articleFavoritesService.findOne(articleId, user);
  }

  @Delete('articles/:articleId')
  public async removeArticleFavorite(
    @Param('articleId', ParseIntPipe) articleId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.articleFavoritesService.remove(articleId, user);
  }
}
