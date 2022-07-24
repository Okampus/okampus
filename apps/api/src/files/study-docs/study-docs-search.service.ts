import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../../shared/configs/typesense.config';
import RequireTypesense from '../../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { authorizeNotFound, SearchService } from '../../shared/modules/search/search.service';
import { StudyDoc } from './study-doc.entity';

export interface IndexedStudyDoc {
  user: string;
  name: string;
  subjectName: string;
  subjectEnglishName: string;
  year: number;
  description: string | null;
  id: string;
  createdAt: string;
}

@Injectable()
export class StudyDocSearchService extends SearchService<StudyDoc, IndexedStudyDoc> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'study-docs',
    fields: [
      { name: 'user', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'subjectName', type: 'string' },
      { name: 'subjectEnglishName', type: 'string' },
      { name: 'year', type: 'int32' },
      { name: 'description', type: 'string', optional: true },
      { name: 'createdAt', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedStudyDoc>('study-docs').documents();

  constructor(
    @InjectRepository(StudyDoc) private readonly studyDocRepository: BaseRepository<StudyDoc>,
  ) { super(StudyDocSearchService.schema, 'study-docs'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const studyDocs = await this.studyDocRepository.find({}, { populate: ['file', 'file.user', 'subject'] });
    await super.init(studyDocs, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(studyDoc: StudyDoc): Promise<void> {
    await this.documents.create(this.toIndexedEntity(studyDoc));
  }

  @RequireTypesense()
  public async update(studyDoc: StudyDoc): Promise<void> {
    await this.documents.update(this.toIndexedEntity(studyDoc)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(id: string): Promise<void> {
    await this.documents.delete(id).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedStudyDoc>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<StudyDoc>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const ids = results.hits.map(hit => hit.document.id);
      const studyDocs = await this.studyDocRepository.find({ id: { $in: ids } });
      for (const hit of results.hits)
        // @ts-expect-error: hit.document is an IndexedStudyDoc but we are overwriting it with a StudyDoc
        hit.document = studyDocs.find(studyDoc => studyDoc.id === hit.document.id)!;
    }
    // @ts-expect-error: this is now a SearchResponse<StudyDoc>
    return results;
  }

  public toIndexedEntity(studyDoc: StudyDoc): IndexedStudyDoc {
    return {
      user: studyDoc.file.user.id,
      name: studyDoc.file.name,
      subjectName: studyDoc.subject.name,
      subjectEnglishName: studyDoc.subject.englishName,
      year: studyDoc.year,
      description: studyDoc.description,
      id: studyDoc.id,
      createdAt: studyDoc.createdAt.toString(),
    };
  }
}
