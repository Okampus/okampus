import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../../shared/configs/typesense.config';
import RequireTypesense from '../../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { SchoolYear } from '../../shared/lib/types/enums/school-year.enum';
import { authorizeNotFound, SearchService } from '../../shared/modules/search/search.service';
import { InfoDoc } from './info-doc.entity';

export interface IndexedInfoDoc {
  user: string;
  name: string;
  year: number;
  schoolYear?: string;
  description?: string;
  id: string;
  createdAt: string;
}

@Injectable()
export class InfoDocSearchService extends SearchService<InfoDoc, IndexedInfoDoc> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'info-docs',
    fields: [
      { name: 'user', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'year', type: 'int32' },
      { name: 'schoolYear', type: 'string', optional: true },
      { name: 'description', type: 'string', optional: true },
      { name: 'createdAt', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedInfoDoc>('info-docs').documents();

  constructor(
    @InjectRepository(InfoDoc) private readonly infoDocRepository: BaseRepository<InfoDoc>,
  ) { super(InfoDocSearchService.schema, 'info-docs'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const infoDocs = await this.infoDocRepository.find({}, { populate: ['file', 'file.user'] });
    await super.init(infoDocs, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(infoDoc: InfoDoc): Promise<void> {
    await this.documents.create(this.toIndexedEntity(infoDoc));
  }

  @RequireTypesense()
  public async update(infoDoc: InfoDoc): Promise<void> {
    await this.documents.update(this.toIndexedEntity(infoDoc)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(infoDocId: string): Promise<void> {
    await this.documents.delete(infoDocId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedInfoDoc>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<InfoDoc>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const infoDocIds = results.hits.map(hit => hit.document.id);
      const infoDocs = await this.infoDocRepository.find({ infoDocId: { $in: infoDocIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedInfoDoc.id and
        // InfoDoc.infoDocId. I know.
        hit.document = infoDocs.find(infoDoc => infoDoc.infoDocId.toString() === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(infoDoc: InfoDoc): IndexedInfoDoc {
    return {
      user: infoDoc.file.user.userId,
      name: infoDoc.file.name,
      year: infoDoc.year,
      schoolYear: infoDoc.schoolYear ? SchoolYear[infoDoc.schoolYear] : undefined,
      description: infoDoc.description,
      id: infoDoc.infoDocId,
      createdAt: infoDoc.createdAt.toString(),
    };
  }
}
