import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { CreateSchoolGroupDto } from './dto/create-school-group.dto';
import type { UpdateSchoolGroupDto } from './dto/update-school-group.dto';
import { SchoolGroup } from './school-group.entity';

@Injectable()
export class SchoolGroupsService {
  constructor(
    @InjectRepository(SchoolGroup) private readonly schoolGroupRepository: BaseRepository<SchoolGroup>,
  ) {}

  public async create(createSchoolGroupDto: CreateSchoolGroupDto): Promise<SchoolGroup> {
    const parent = createSchoolGroupDto.parentId
      ? await this.schoolGroupRepository.findOneOrFail({ id: createSchoolGroupDto.parentId })
      : null;

    const schoolGroup = new SchoolGroup({
      ...createSchoolGroupDto,
      parent,
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

  public async findOne(id: string): Promise<SchoolGroup> {
    return await this.schoolGroupRepository.findOneOrFail({ id });
  }

  public async update(id: string, updateSchoolGroupDto: UpdateSchoolGroupDto): Promise<SchoolGroup> {
    const parent = updateSchoolGroupDto.parentId
      ? await this.schoolGroupRepository.findOneOrFail({ id: updateSchoolGroupDto.parentId })
      : null;

    const schoolGroup = await this.schoolGroupRepository.findOneOrFail({ id });

    wrap(schoolGroup).assign({ ...updateSchoolGroupDto, ...(parent ? { parent } : {}) });
    await this.schoolGroupRepository.flush();
    return schoolGroup;
  }

  // TODO: differentiate soft from hard delete
  public async remove(id: string): Promise<void> {
    const schoolGroup = await this.schoolGroupRepository.findOneOrFail({ id });
    await this.schoolGroupRepository.removeAndFlush(schoolGroup);
  }
}
