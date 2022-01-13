import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Article } from '../articles/entities/article.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { Reply } from '../replies/entities/reply.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { ArticleReport } from './entities/article-report.entity';
import { CommentReport } from './entities/comment-report.entity';
import { PostReport } from './entities/post-report.entity';
import { ReplyReport } from './entities/reply-report.entity';
import { Report } from './entities/report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ArticleReportsService } from './services/article-reports.service';
import { CommentReportsService } from './services/comment-reports.service';
import { PostReportsService } from './services/post-reports.service';
import { ReplyReportsService } from './services/reply-reports.service';
import { ReportSearchService } from './services/report-search.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Report,
      Post,
      PostReport,
      Reply,
      ReplyReport,
      Comment,
      CommentReport,
      Article,
      ArticleReport,
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    CaslAbilityFactory,
    ReportsService,
    PostReportsService,
    ReplyReportsService,
    CommentReportsService,
    ArticleReportsService,
    ReportSearchService,
  ],
  exports: [],
})
export class ReportsModule implements OnModuleInit {
  constructor(
    private readonly reportSearchService: ReportSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.reportSearchService.init();
  }
}
