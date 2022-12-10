import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CreateSchoolYearDto } from '@classes/school-year/dto/create-school-year.dto';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { BaseRepository } from '@lib/orm/base.repository';
import type { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYear } from './school-year.entity';

@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear) private readonly schoolYearRepository: BaseRepository<SchoolYear>,
  ) {}

  public async create(createSchoolYearDto: CreateSchoolYearDto): Promise<SchoolYear> {
    const schoolYear = new SchoolYear(createSchoolYearDto);
    await this.schoolYearRepository.persistAndFlush(schoolYear);
    return schoolYear;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedNodes<SchoolYear>> {
    return await this.schoolYearRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: string): Promise<SchoolYear> {
    return this.schoolYearRepository.findOneOrFail({ id });
  }

  public async update(id: string, updateSchoolYearDto: UpdateSchoolYearDto): Promise<SchoolYear> {
    const schoolYear = await this.schoolYearRepository.findOneOrFail({ id });
    wrap(schoolYear).assign(updateSchoolYearDto);
    await this.schoolYearRepository.flush();
    return schoolYear;
  }

  // TODO: differentiate soft from hard delete
  public async remove(id: string): Promise<void> {
    const schoolYear = await this.schoolYearRepository.findOneOrFail({ id });
    await this.schoolYearRepository.removeAndFlush(schoolYear);
  }
}
