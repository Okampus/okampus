import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { Subject } from '../../subjects/subject.entity';
import type { User } from '../../users/user.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { CreateStudyDocDto } from './dto/create-study-doc.dto';
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
    const subject = await this.subjectRepository.findOneOrFail({ subjectId: createStudyDocDto.subject });

    const docSeries = await this.docSeriesRepository.findOne({ docSeriesId: createStudyDocDto.docSeries }, ['tags']);
    const studyDoc = new StudyDoc({
      ...createStudyDocDto,
      subject,
      file,
      docSeries,
    });
    await this.studyDocRepository.persistAndFlush(studyDoc);
    return studyDoc;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<StudyDoc>> {
    // TODO: Maybe the user won't have access to all docs. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.studyDocRepository.findWithPagination(paginationOptions, {}, { populate: ['file', 'subject', 'docSeries', 'tags'] });
  }

  public async findOne(studyDocId: string): Promise<StudyDoc> {
    // TODO: Maybe the user won't have access to this doc. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.studyDocRepository.findOneOrFail({ studyDocId }, ['file', 'subject', 'docSeries', 'tags']);
  }

  public async update(user: User, studyDocId: string, updateCourseDto: UpdateStudyDocDto): Promise<StudyDoc> {
    const studyDoc = await this.studyDocRepository.findOneOrFail({ studyDocId }, ['file', 'subject', 'docSeries', 'tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, studyDoc);

    wrap(studyDoc).assign(updateCourseDto);
    await this.studyDocRepository.flush();
    return studyDoc;
  }

  public async remove(user: User, studyDocId: string): Promise<void> {
    const studyDoc = await this.studyDocRepository.findOneOrFail({ studyDocId }, ['file']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, studyDoc);

    await this.studyDocRepository.removeAndFlush(studyDoc);
  }
}
