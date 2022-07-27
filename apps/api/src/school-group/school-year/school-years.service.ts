import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
// Import { BadRequestException, Injectable } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
// Import { assertPermissions } from '../../../shared/lib/utils/assert-permission';
// import { Action } from '../../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { CreateSchoolYearDto } from './dto/create-school-year.dto';
import type { UpdateSchoolYearDto } from './dto/update-school-year.dto';
// Import type { User } from '../users/user.entity';
import { SchoolYear } from './school-year.entity';

@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear) private readonly schoolYearRepository: BaseRepository<SchoolYear>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createSchoolYearDto: CreateSchoolYearDto): Promise<SchoolYear> {
    const schoolYear = new SchoolYear(createSchoolYearDto);
    await this.schoolYearRepository.persistAndFlush(schoolYear);
    return schoolYear;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<SchoolYear>> {
    return await this.schoolYearRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: number): Promise<SchoolYear> {
    return this.schoolYearRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateSchoolYearDto: UpdateSchoolYearDto): Promise<SchoolYear> {
    const schoolYear = await this.schoolYearRepository.findOneOrFail({ id });
    wrap(schoolYear).assign(updateSchoolYearDto);
    await this.schoolYearRepository.flush();
    return schoolYear;
  }

  // TODO: differentiate soft from hard delete
  public async remove(id: number): Promise<void> {
    const schoolYear = await this.schoolYearRepository.findOneOrFail({ id });
    await this.schoolYearRepository.removeAndFlush(schoolYear);
  }
}
