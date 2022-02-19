import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import groupBy from 'lodash.groupby';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { Cursus } from '../../shared/lib/types/cursus.enum';
import type { Category, StudyDocCategoryType } from '../../shared/lib/types/docs-category.type';
import type { ValueOf } from '../../shared/lib/types/valueof.type';
import { assertPermissions } from '../../shared/lib/utils/assert-permission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginateDto } from '../../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { Subject } from '../../subjects/subject.entity';
import type { User } from '../../users/user.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { CreateStudyDocDto } from './dto/create-study-doc.dto';
import type { DocsFilterDto } from './dto/docs-filter.dto';
import type { UpdateStudyDocDto } from './dto/update-study-doc.dto';
import { StudyDoc } from './study-doc.entity';
import { StudyDocSearchService } from './study-docs-search.service';

@Injectable()
export class StudyDocsService {
  constructor(
    @InjectRepository(StudyDoc) private readonly studyDocRepository: BaseRepository<StudyDoc>,
    @InjectRepository(Subject) private readonly subjectRepository: BaseRepository<Subject>,
    @InjectRepository(DocSeries) private readonly docSeriesRepository: BaseRepository<DocSeries>,
    private readonly studyDocSearchService: StudyDocSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createStudyDocDto: CreateStudyDocDto, file: FileUpload): Promise<StudyDoc> {
    const subject = await this.subjectRepository.findOneOrFail({ subjectId: createStudyDocDto.subject });

    const docSeries = await this.docSeriesRepository.findOne({ docSeriesId: createStudyDocDto.docSeries });
    const studyDoc = new StudyDoc({
      ...createStudyDocDto,
      subject,
      file,
      docSeries,
    });
    await this.studyDocRepository.persistAndFlush(studyDoc);
    await this.studyDocSearchService.add(studyDoc);
    return studyDoc;
  }

  public async findAll(
    filters: DocsFilterDto,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<StudyDoc>> {
    // TODO: Maybe the user won't have access to all docs. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    let options: FilterQuery<StudyDoc> = {};
    if (typeof filters.schoolYear !== 'undefined')
      options = { ...options, subject: { schoolYear: filters.schoolYear } };
    if (typeof filters.year !== 'undefined')
      options = { ...options, year: filters.year };
    if (typeof filters.subject !== 'undefined')
      options = { ...options, subject: { subjectId: filters.subject } };
    if (typeof filters.type !== 'undefined')
      options = { ...options, type: filters.type };
    if (typeof filters.cursus !== 'undefined')
      options = { ...options, cursus: { $in: [filters.cursus, Cursus.All] } };

    return await this.studyDocRepository.findWithPagination(
      paginationOptions,
      options,
      { populate: ['file', 'file.user', 'subject', 'docSeries'] },
    );
  }

  public async findCategories(baseFilters: StudyDocCategoryType[]): Promise<Array<Category<StudyDocCategoryType>>> {
    const allDocuments: StudyDoc[] = await this.studyDocRepository.findAll({ populate: ['subject'] });

    const groupFilters: Record<StudyDocCategoryType, (elt: StudyDoc) => ValueOf<StudyDoc>> = {
      schoolYear: elt => elt.subject.schoolYear,
      subject: elt => elt.subject.subjectId,
      type: elt => elt.type,
      year: elt => elt.year,
    } as const;

    const computeChildren = (
      documents: StudyDoc[],
      filters: StudyDocCategoryType[],
    ): Array<Category<StudyDocCategoryType>> =>
      Object.entries(groupBy(documents, groupFilters[filters[0]]))
        .map(([title, value]) => ({
          title,
          context: filters[0],
          children: filters.length === 1 ? [] : computeChildren(value, filters.slice(1)),
        }));

    return computeChildren(allDocuments, baseFilters)
      .flatMap(category => (category.title === 'undefined' ? category.children : category));
  }

  public async findOne(studyDocId: string): Promise<StudyDoc> {
    // TODO: Maybe the user won't have access to this doc. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.studyDocRepository.findOneOrFail(
      { studyDocId },
      { populate: ['file', 'file.user', 'subject', 'docSeries'] },
    );
  }

  public async update(user: User, studyDocId: string, updateCourseDto: UpdateStudyDocDto): Promise<StudyDoc> {
    const studyDoc = await this.studyDocRepository.findOneOrFail(
      { studyDocId },
      { populate: ['file', 'file.user', 'subject', 'docSeries'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, studyDoc);

    const subject = await this.subjectRepository.findOneOrFail({ subjectId: updateCourseDto.subject });
    const docSeries = await this.docSeriesRepository.findOneOrFail({ docSeriesId: updateCourseDto.docSeries });

    wrap(studyDoc).assign({ ...updateCourseDto, subject, docSeries });
    await this.studyDocRepository.flush();
    await this.studyDocSearchService.update(studyDoc);
    return studyDoc;
  }

  public async remove(user: User, studyDocId: string): Promise<void> {
    const studyDoc = await this.studyDocRepository.findOneOrFail({ studyDocId }, { populate: ['file', 'file.user'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, studyDoc);

    await this.studyDocRepository.removeAndFlush(studyDoc);
    await this.studyDocSearchService.remove(studyDoc.studyDocId);
  }
}
