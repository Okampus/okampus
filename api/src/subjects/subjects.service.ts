import { EntityRepository, UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateSubjectDto } from './dto/create-subject.dto';
import type { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private readonly subjectRepository: EntityRepository<Subject>,
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

  public async findAll(): Promise<Subject[]> {
    return await this.subjectRepository.findAll();
  }

  public async findOne(subjectId: string): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ subjectId });
    if (!subject)
      throw new NotFoundException('Subject not found');
    return subject;
  }

  public async update(subjectId: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ subjectId });
    if (!subject)
      throw new NotFoundException('Tag not found');
    wrap(subject).assign(updateSubjectDto);
    await this.subjectRepository.flush();
    return subject;
  }

  public async remove(subjectId: string): Promise<void> {
    const subject = await this.subjectRepository.findOne({ subjectId });
    if (!subject)
      throw new NotFoundException('Subject not found');

    await this.subjectRepository.removeAndFlush(subject);
  }
}
