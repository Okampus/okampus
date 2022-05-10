import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../shared/configs/typesense.config';
import RequireTypesense from '../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { SchoolYear } from '../shared/lib/types/enums/school-year.enum';
import { authorizeNotFound, SearchService } from '../shared/modules/search/search.service';
import { Subject } from './subject.entity';

export interface IndexedSubject {
  code: string;
  name: string;
  englishName: string;
  schoolYear: string;
  description?: string;
  id: string;
}

@Injectable()
export class SubjectSearchService extends SearchService<Subject, IndexedSubject> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'subjects',
    fields: [
      { name: 'code', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'englishName', type: 'string' },
      { name: 'schoolYear', type: 'string' },
      { name: 'description', type: 'string', optional: true },
    ],
  };

  private readonly documents = client.collections<IndexedSubject>('subjects').documents();

  constructor(
    @InjectRepository(Subject) private readonly subjectRepository: BaseRepository<Subject>,
  ) { super(SubjectSearchService.schema, 'subjects'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const subjects = await this.subjectRepository.findAll();
    await super.init(subjects, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(subject: Subject): Promise<void> {
    await this.documents.create(this.toIndexedEntity(subject));
  }

  @RequireTypesense()
  public async update(subject: Subject): Promise<void> {
    await this.documents.update(this.toIndexedEntity(subject)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(subjectId: string): Promise<void> {
    await this.documents.delete(subjectId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedSubject>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Subject>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const subjectIds = results.hits.map(hit => hit.document.id);
      const subjects = await this.subjectRepository.find({ subjectId: { $in: subjectIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedSubject.id and
        // Subject.subjectId. I know.
        hit.document = subjects.find(subject => subject.subjectId === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(subject: Subject): IndexedSubject {
    return {
      code: subject.subjectId,
      name: subject.name,
      englishName: subject.englishName,
      schoolYear: SchoolYear[subject.schoolYear],
      description: subject.description,
      id: subject.subjectId,
    };
  }
}
