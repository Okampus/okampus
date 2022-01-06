import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { ArticleSearchService } from './article-search.service';
import { ArticleVotesService } from './article-votes.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleVote } from './entities/article-vote.entity';
import { Article } from './entities/article.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Article, ArticleVote, Tag]),
  ],
  controllers: [ArticlesController],
  providers: [CaslAbilityFactory, ArticlesService, ArticleVotesService, ArticleSearchService],
  exports: [ArticlesService],
})
export class ArticlesModule {
  constructor(
    private readonly articleSearchService: ArticleSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.articleSearchService.init();
  }
}
