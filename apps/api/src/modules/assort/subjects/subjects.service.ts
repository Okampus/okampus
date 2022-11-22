import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import type { CreateSubjectDto } from '@modules/assort/subjects/dto/create-subject.dto';
import { Class } from '@modules/org/classes/class.entity';
import type { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private readonly subjectRepository: BaseRepository<Subject>,
    @InjectRepository(Class) private readonly classRepository: BaseRepository<Class>,
  ) {}

  public async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const { classId, ...createSubject } = createSubjectDto;

    const schoolClass = (typeof classId === 'string')
      ? await this.classRepository.findOneOrFail({ id: classId })
      : null;

    const subject = new Subject({ ...createSubject, schoolClass });
    try {
      await this.subjectRepository.persistAndFlush(subject);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Subject code already exists');
      throw error;
    }
    return subject;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Subject>> {
    return await this.subjectRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: number): Promise<Subject> {
    return await this.subjectRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.subjectRepository.findOneOrFail({ id });

    const { classId, ...updateSubject } = updateSubjectDto;

    const schoolClass = (typeof classId === 'string')
      ? await this.classRepository.findOneOrFail({ id: classId })
      : subject.schoolClass;

    wrap(subject).assign({ ...updateSubject, schoolClass });
    await this.subjectRepository.flush();
    return subject;
  }

  public async remove(id: number): Promise<void> {
    const subject = await this.subjectRepository.findOneOrFail({ id });
    await this.subjectRepository.removeAndFlush(subject);
  }
}
