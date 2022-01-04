import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Article } from '../articles/entities/article.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { Reply } from '../replies/entities/reply.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { ArticleFavorite } from './entities/article-favorite.entity';
import { CommentFavorite } from './entities/comment-favorite.entity';
import { Favorite } from './entities/favorite.entity';
import { PostFavorite } from './entities/post-favorite.entity';
import { ReplyFavorite } from './entities/reply-favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { ArticleFavoritesService } from './services/article-favorites.service';
import { CommentFavoritesService } from './services/comment-favorites.service';
import { PostFavoritesService } from './services/post-favorites.service';
import { ReplyFavoritesService } from './services/reply-favorites.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Favorite,
      Post,
      PostFavorite,
      Reply,
      ReplyFavorite,
      Comment,
      CommentFavorite,
      Article,
      ArticleFavorite,
    ]),
  ],
  controllers: [FavoritesController],
  providers: [
    CaslAbilityFactory,
    FavoritesService,
    PostFavoritesService,
    ReplyFavoritesService,
    CommentFavoritesService,
    ArticleFavoritesService,
  ],
  exports: [],
})
export class FavoritesModule {}
