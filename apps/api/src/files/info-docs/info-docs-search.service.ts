import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../../shared/configs/typesense.config';
import RequireTypesense from '../../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { authorizeNotFound, SearchService } from '../../shared/modules/search/search.service';
import { InfoDoc } from './info-doc.entity';

// TODO: deal with infoDoc's schoolGroup
export interface IndexedInfoDoc {
  user: string;
  name: string;
  year: number;
  description: string | null;
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
  public async remove(id: string): Promise<void> {
    await this.documents.delete(id).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedInfoDoc>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<InfoDoc>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const ids = results.hits.map(hit => hit.document.id);
      const infoDocs = await this.infoDocRepository.find({ id: { $in: ids } });
      for (const hit of results.hits)
        // @ts-expect-error: hit.document is an IndexedInfoDoc but we are overwriting it with an InfoDoc
        hit.document = infoDocs.find(infoDoc => infoDoc.id === hit.document.id)!;
    }
    // @ts-expect-error: this is now a SearchResponse<InfoDoc>
    return results;
  }

  public toIndexedEntity(infoDoc: InfoDoc): IndexedInfoDoc {
    return {
      user: infoDoc.file.user.id,
      name: infoDoc.file.name,
      year: infoDoc.year,
      description: infoDoc.description,
      id: infoDoc.id,
      createdAt: infoDoc.createdAt.toString(),
    };
  }
}
