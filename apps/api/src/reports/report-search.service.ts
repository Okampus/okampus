import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import removeMarkdown from 'markdown-to-text';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../shared/configs/typesense.config';
import RequireTypesense from '../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { authorizeNotFound, SearchService } from '../shared/modules/search/search.service';
import { Report } from './report.entity';

export interface IndexedReport {
  user: string;
  target: string;
  reason: string | null;
  body: string | null;
  id: string;
  createdAt: string;
}

@Injectable()
export class ReportSearchService extends SearchService<Report, IndexedReport> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'reports',
    fields: [
      { name: 'user', type: 'string' },
      { name: 'target', type: 'string' },
      { name: 'reason', type: 'string', optional: true },
      { name: 'body', type: 'string', optional: true },
      { name: 'createdAt', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedReport>('reports').documents();

  constructor(
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
  ) { super(ReportSearchService.schema, 'reports'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const reports = await this.reportRepository.find({}, { populate: ['user', 'content', 'target'] });
    await super.init(reports, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(report: Report): Promise<void> {
    await this.documents.create(this.toIndexedEntity(report));
  }

  @RequireTypesense()
  public async update(report: Report): Promise<void> {
    await this.documents.update(this.toIndexedEntity(report)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(id: string): Promise<void> {
    await this.documents.delete(id).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedReport>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Report>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const ids = results.hits.map(hit => hit.document.id).map(Number);
      const reports = await this.reportRepository.find({ id: { $in: ids } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedReport.id and
        // Report.id. I know.
        hit.document = reports.find(report => report.id.toString() === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(report: Report): IndexedReport {
    return {
      user: report.user.id,
      target: report.target.id,
      reason: report.reason,
      body: report.content ? removeMarkdown(report.content.body) : null,
      id: report.id.toString(),
      createdAt: report.createdAt.toString(),
    };
  }
}
