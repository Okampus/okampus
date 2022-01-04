import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleVote } from './entities/article-vote.entity';
import { Article } from './entities/article.entity';
import { ArticleVotesService } from './services/article-votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Article, ArticleVote, Tag]),
  ],
  controllers: [ArticlesController],
  providers: [CaslAbilityFactory, ArticlesService, ArticleVotesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
