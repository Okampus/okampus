import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import RequireTypesense from '../../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { extractTextFromStringifiedTiptap } from '../../shared/lib/utils/extractTextFromTiptap';
import { authorizeNotFound, SearchService } from '../../shared/modules/search/search.service';
import { client } from '../../typesense.config';
import type { ArticleReport } from '../entities/article-report.entity';
import type { CommentReport } from '../entities/comment-report.entity';
import type { PostReport } from '../entities/post-report.entity';
import type { ReplyReport } from '../entities/reply-report.entity';
import { Report } from '../entities/report.entity';

export interface IndexedReport {
  reason: string;
  user: string;
  postTitle?: string;
  postBody?: string;
  reply?: string;
  comment?: string;
  articleTitle?: string;
  articleBody?: string;
  id: string;
  createdAt: string;
}

type AllReports = ArticleReport | CommentReport | PostReport | ReplyReport;

@Injectable()
export class ReportSearchService extends SearchService<Report, IndexedReport> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'reports',
    fields: [
      { name: 'reason', type: 'string' },
      { name: 'user', type: 'string' },
      { name: 'postTitle', type: 'string', optional: true },
      { name: 'postBody', type: 'string', optional: true },
      { name: 'reply', type: 'string', optional: true },
      { name: 'comment', type: 'string', optional: true },
      { name: 'articleTitle', type: 'string', optional: true },
      { name: 'articleBody', type: 'string', optional: true },
      { name: 'createdAt', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedReport>('reports').documents();

  constructor(
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
  ) { super(ReportSearchService.schema, 'reports'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const reports = await this.reportRepository.find({}, ['user', 'post', 'reply', 'comment', 'article']);
    await super.init(reports, entity => this.toIndexedEntity(entity as AllReports));
  }

  @RequireTypesense()
  public async add(report: AllReports): Promise<void> {
    await this.documents.create(this.toIndexedEntity(report));
  }

  @RequireTypesense()
  public async update(report: AllReports): Promise<void> {
    await this.documents.update(this.toIndexedEntity(report)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(reportId: string): Promise<void> {
    await this.documents.delete(reportId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams<IndexedReport>): Promise<SearchResponse<IndexedReport>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams<IndexedReport>): Promise<SearchResponse<Report>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const reportIds = results.hits.map(hit => hit.document.id).map(Number);
      const reports = await this.reportRepository.find({ reportId: { $in: reportIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedReport.id and
        // Report.reportId. I know.
        hit.document = reports.find(report => report.reportId.toString() === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(report: AllReports): IndexedReport {
    return {
      /* eslint-disable no-undefined */
      reason: report.reason,
      user: report.user.userId,
      postTitle: 'post' in report ? report.post.title : undefined,
      postBody: 'post' in report ? extractTextFromStringifiedTiptap(report.post.body) : undefined,
      reply: 'reply' in report ? extractTextFromStringifiedTiptap(report.reply.body) : undefined,
      comment: 'comment' in report ? extractTextFromStringifiedTiptap(report.comment.body) : undefined,
      articleTitle: 'article' in report ? report.article.title : undefined,
      articleBody: 'article' in report ? extractTextFromStringifiedTiptap(report.article.body) : undefined,
      id: report.reportId.toString(),
      createdAt: report.createdAt.toString(),
      /* eslint-enable no-undefined */
    };
  }
}
