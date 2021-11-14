import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from '../../subjects/subject.entity';
import type { User } from '../../users/user.entity';
import type { CreateStudyDocDto } from '../dto/create-study-doc.dto';
import type { UpdateStudyDocDto } from '../dto/update-study-doc.dto';
import { DocSeries } from '../entities/doc-series.entity';
import type { FileUpload } from '../entities/file-upload.entity';
import { StudyDoc } from '../entities/study-doc.entity';

@Injectable()
export class StudyDocsService {
  constructor(
    @InjectRepository(StudyDoc) private readonly studyDocRepository: EntityRepository<StudyDoc>,
    @InjectRepository(Subject) private readonly subjectRepository: EntityRepository<Subject>,
    @InjectRepository(DocSeries) private readonly docSeriesRepository: EntityRepository<DocSeries>,
  ) {}

  public async getStudyDocById(studyDocId: number): Promise<StudyDoc | null> {
    return await this.studyDocRepository.findOne({ studyDocId });
  }

  public async create(createStudyDocDto: CreateStudyDocDto, file: FileUpload): Promise<StudyDoc> {
    const subject = await this.subjectRepository.findOne({ subjectId: createStudyDocDto.subject });
    if (!subject)
      throw new NotFoundException('Subject not found');

    const docSeries = await this.docSeriesRepository.findOne({ docSeriesId: createStudyDocDto.docSeries });
    const studyDoc = new StudyDoc({
      ...createStudyDocDto, subject, file, docSeries,
    });
    await this.studyDocRepository.persistAndFlush(studyDoc);
    return studyDoc;
  }

  public async findAll(
    paginationOptions?: { offset: number; limit: number },
  ): Promise<{ items: StudyDoc[]; total: number }> {
    const [items, total] = await this.studyDocRepository.findAndCount({}, paginationOptions);
    return { items, total };
  }

  public async findOne(studyDocId: number): Promise<StudyDoc> {
    const studyDoc = await this.studyDocRepository.findOne({ studyDocId });
    if (!studyDoc)
      throw new NotFoundException('Document not found');
    return studyDoc;
  }

  public async update(user: User, studyDocId: number, updateCourseDto: UpdateStudyDocDto): Promise<StudyDoc> {
    const studyDoc = await this.studyDocRepository.findOne({ studyDocId });
    if (!studyDoc)
      throw new NotFoundException('Document not found');
    if (studyDoc.file.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    wrap(studyDoc).assign(updateCourseDto);
    await this.studyDocRepository.flush();
    return studyDoc;
  }

  public async remove(user: User, studyDocId: number): Promise<void> {
    const studyDoc = await this.studyDocRepository.findOne({ studyDocId });
    if (!studyDoc)
      throw new NotFoundException('Document not found');
    if (studyDoc.file.author.userId !== user.userId)
      throw new ForbiddenException('Not the author');

    await this.studyDocRepository.removeAndFlush(studyDoc);
  }
}
