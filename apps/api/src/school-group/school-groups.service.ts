import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import type { CreateSchoolGroupDto } from './dto/create-school-group.dto';
import type { UpdateSchoolGroupDto } from './dto/update-school-group.dto';
import { SchoolGroup } from './school-group.entity';

@Injectable()
export class SchoolGroupsService {
  constructor(
    @InjectRepository(SchoolGroup) private readonly schoolGroupRepository: BaseRepository<SchoolGroup>,
  ) {}

  public async create(createSchoolGroupDto: CreateSchoolGroupDto): Promise<SchoolGroup> {
    const parent = createSchoolGroupDto.parentCode
      ? await this.schoolGroupRepository.findOneOrFail({ code: createSchoolGroupDto.parentCode })
      : null;

    const schoolGroup = new SchoolGroup({
      ...createSchoolGroupDto,
      ...(parent ? { parent } : {}),
    });

    try {
      await this.schoolGroupRepository.persistAndFlush(schoolGroup);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('SchoolGroup code already exists');
      throw error;
    }
    return schoolGroup;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<SchoolGroup>> {
    return await this.schoolGroupRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: number): Promise<SchoolGroup> {
    return await this.schoolGroupRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateSchoolGroupDto: UpdateSchoolGroupDto): Promise<SchoolGroup> {
    const parent = updateSchoolGroupDto.parentCode
      ? await this.schoolGroupRepository.findOneOrFail({ code: updateSchoolGroupDto.parentCode })
      : null;

    const schoolGroup = await this.schoolGroupRepository.findOneOrFail({ id });
    const { id: _, ...previousSchoolGroup } = schoolGroup;

    wrap(schoolGroup).assign({ ...previousSchoolGroup, ...updateSchoolGroupDto, ...(parent ? { parent } : {}) });
    await this.schoolGroupRepository.flush();
    return schoolGroup;
  }

  // TODO: differentiate soft from hard delete
  public async remove(id: number): Promise<void> {
    const schoolGroup = await this.schoolGroupRepository.findOneOrFail({ id });
    await this.schoolGroupRepository.removeAndFlush(schoolGroup);
  }
}
