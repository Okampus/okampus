import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { UsersModule } from '../users/users.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleReaction } from './entities/article-reaction.entity';
import { ArticleVote } from './entities/article-vote.entity';
import { Article } from './entities/article.entity';
import { ArticleReactionsService } from './services/article-reactions.service';
import { ArticleVotesService } from './services/article-votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Article, ArticleVote, ArticleReaction, Tag]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ArticlesController],
  providers: [CaslAbilityFactory, ArticlesService, ArticleVotesService, ArticleReactionsService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
