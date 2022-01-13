import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Article } from '../../articles/entities/article.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import type { CreateReportDto } from '../dto/create-report.dto';
import { ArticleReport } from '../entities/article-report.entity';
import { ReportSearchService } from './report-search.service';

@Injectable()
export class ArticleReportsService {
  constructor(
    @InjectRepository(ArticleReport) private readonly articleReportRepository: BaseRepository<ArticleReport>,
    @InjectRepository(Article) private readonly articleRepository: BaseRepository<Article>,
    private readonly reportSearchService: ReportSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(articleId: number, user: User, createReportDto: CreateReportDto): Promise<ArticleReport> {
    const article = await this.articleRepository.findOneOrFail({ articleId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Report, article);

    const reports = await this.articleReportRepository.count({ article, user });
    if (reports !== 0)
      throw new BadRequestException('User already reported this article');

    const report = new ArticleReport({ article, user, ...createReportDto });
    await this.articleReportRepository.persistAndFlush(report);
    await this.reportSearchService.add(report);
    return report;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<ArticleReport>> {
    return await this.articleReportRepository.findWithPagination(
      paginationOptions,
      { kind: 'article' },
      { populate: ['article', 'user'] },
    );
  }

  public async findAllReportsForArticle(
    articleId: number,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<ArticleReport>> {
    return await this.articleReportRepository.findWithPagination(
      paginationOptions,
      { article: { articleId } },
      { populate: ['article', 'user'] },
    );
  }
}
