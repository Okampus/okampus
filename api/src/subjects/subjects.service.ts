import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { CreateSubjectDto } from './dto/create-subject.dto';
import type { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private readonly subjectRepository: BaseRepository<Subject>,
  ) {}

  public async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject(createSubjectDto);
    try {
      await this.subjectRepository.persistAndFlush(subject);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Subject code already exists');
      throw error;
    }
    return subject;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Subject>> {
    return await this.subjectRepository.findWithPagination(paginationOptions);
  }

  public async findOne(subjectId: string): Promise<Subject> {
    return await this.subjectRepository.findOneOrFail({ subjectId });
  }

  public async update(subjectId: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.subjectRepository.findOneOrFail({ subjectId });

    wrap(subject).assign(updateSubjectDto);
    await this.subjectRepository.flush();
    return subject;
  }

  public async remove(subjectId: string): Promise<void> {
    const subject = await this.subjectRepository.findOneOrFail({ subjectId });
    await this.subjectRepository.removeAndFlush(subject);
  }
}
