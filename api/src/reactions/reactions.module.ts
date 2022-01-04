import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Article } from '../articles/entities/article.entity';
import { Post } from '../posts/entities/post.entity';
import { Reply } from '../replies/entities/reply.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { ArticleReaction } from './entities/article-reaction.entity';
import { PostReaction } from './entities/post-reaction.entity';
import { ReplyReaction } from './entities/reply-reaction.entity';
import { ReactionsController } from './reactions.controller';
import { ArticleReactionsService } from './services/article-reactions.service';
import { PostReactionsService } from './services/post-reactions.service';
import { ReplyReactionsService } from './services/reply-reactions.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Post,
      PostReaction,
      Reply,
      ReplyReaction,
      Article,
      ArticleReaction,
  ]),
  ],
  controllers: [ReactionsController],
  providers: [
    CaslAbilityFactory,
    PostReactionsService,
    ReplyReactionsService,
    ArticleReactionsService,
  ],
  exports: [],
})
export class ReactionsModule {}
