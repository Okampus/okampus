import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import type { CreateSubjectDto } from './dto/create-subject.dto';
import type { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectSearchService } from './subject-search.service';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private readonly subjectRepository: BaseRepository<Subject>,
    private readonly subjectSearchService: SubjectSearchService,
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
    await this.subjectSearchService.add(subject);
    return subject;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Subject>> {
    return await this.subjectRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: string): Promise<Subject> {
    return await this.subjectRepository.findOneOrFail({ id });
  }

  public async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.subjectRepository.findOneOrFail({ id });

    wrap(subject).assign(updateSubjectDto);
    await this.subjectRepository.flush();
    await this.subjectSearchService.update(subject);
    return subject;
  }

  public async remove(id: string): Promise<void> {
    const subject = await this.subjectRepository.findOneOrFail({ id });
    await this.subjectRepository.removeAndFlush(subject);
    await this.subjectSearchService.remove(subject.id);
  }
}
