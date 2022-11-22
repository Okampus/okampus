import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { StudyDocFilter } from '@meta/shared/lib/types/enums/docs-filters.enum';
import { assertPermissions } from '@meta/shared/lib/utils/assert-permission';
import type { Categories, GroupFilters } from '@meta/shared/lib/utils/compute-document-categories';
import { computeDocumentCategories } from '@meta/shared/lib/utils/compute-document-categories';
import { Action } from '@meta/shared/modules/authorization';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import { Subject } from '@modules/assort/subjects/subject.entity';
import type { CreateStudyDocDto } from '@modules/store/study-docs/dto/create-study-doc.dto';
import type { User } from '@modules/uua/users/user.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { DocsFilterDto } from './dto/docs-filter.dto';
import type { UpdateStudyDocDto } from './dto/update-study-doc.dto';
import { StudyDoc } from './study-doc.entity';

@Injectable()
export class StudyDocsService {
  constructor(
    @InjectRepository(StudyDoc) private readonly studyDocRepository: BaseRepository<StudyDoc>,
    @InjectRepository(Subject) private readonly subjectRepository: BaseRepository<Subject>,
    @InjectRepository(DocSeries) private readonly docSeriesRepository: BaseRepository<DocSeries>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createStudyDocDto: CreateStudyDocDto, file: FileUpload): Promise<StudyDoc> {
    const subject = await this.subjectRepository.findOneOrFail({ id: createStudyDocDto.subjectId });
    const docSeries = await this.docSeriesRepository.findOne({ id: createStudyDocDto.docSeries });
    const studyDoc = new StudyDoc({
      ...createStudyDocDto,
      subject,
      file,
      docSeries,
    });

    await this.studyDocRepository.persistAndFlush(studyDoc);
    return studyDoc;
  }

  public async findAll(
    filters: DocsFilterDto,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<StudyDoc>> {
    // TODO: Maybe the user won't have access to all docs. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    let options: FilterQuery<StudyDoc> = {};
    if (typeof filters.year !== 'undefined')
      options = { ...options, year: filters.year };
    if (typeof filters.subject !== 'undefined')
      // @ts-expect-error: ts(2339)
      options = { ...options, subject: { ...options.subject, id: filters.subject } };
    if (typeof filters.type !== 'undefined')
      options = { ...options, type: filters.type };

    return await this.studyDocRepository.findWithPagination(
      paginationOptions,
      options,
      { populate: ['file', 'file.user', 'subject', 'docSeries'] },
    );
  }

  public async findCategories(baseFilters: StudyDocFilter[]): Promise<Categories<StudyDoc>> {
    const allDocuments: StudyDoc[] = await this.studyDocRepository.findAll({ populate: ['subject'] });

    const groupFilters: GroupFilters<StudyDoc> = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Subject: elt => ({ key: elt.subject.id.toString(), metadata: elt.subject.name }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Type: elt => ({ key: elt.type.toString(), metadata: null }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Year: elt => ({ key: elt.year.toString(), metadata: null }),
    } as const;

    return computeDocumentCategories(allDocuments, groupFilters, baseFilters);
  }

  public async findOne(id: string): Promise<StudyDoc> {
    // TODO: Maybe the user won't have access to this doc. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.studyDocRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'subject', 'docSeries'] },
    );
  }

  public async update(user: User, id: string, updateStudyDocDto: UpdateStudyDocDto): Promise<StudyDoc> {
    const studyDoc = await this.studyDocRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'subject', 'docSeries'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, studyDoc);

    const subject = await this.subjectRepository.findOneOrFail({ id: updateStudyDocDto.subjectId });
    const docSeries = await this.docSeriesRepository.findOneOrFail({ id: updateStudyDocDto.docSeries });

    wrap(studyDoc).assign({ ...updateStudyDocDto, subject, docSeries });
    await this.studyDocRepository.flush();
    return studyDoc;
  }

  public async remove(user: User, id: string): Promise<void> {
    const studyDoc = await this.studyDocRepository.findOneOrFail({ id }, { populate: ['file', 'file.user'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, studyDoc);

    await this.studyDocRepository.removeAndFlush(studyDoc);
  }
}
