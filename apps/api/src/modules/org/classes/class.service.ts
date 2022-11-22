import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import type { CreateClassDto } from '@modules/org/classes/dto/create-class.dto';
import { Class } from './class.entity';
import type { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private readonly schoolGroupRepository: BaseRepository<Class>,
  ) {}

  public async create(createClassDto: CreateClassDto): Promise<Class> {
    const parent = createClassDto.parentId
      ? await this.schoolGroupRepository.findOneOrFail({ id: createClassDto.parentId })
      : null;

    const schoolGroup = new Class({
      ...createClassDto,
      parent,
    });

    try {
      await this.schoolGroupRepository.persistAndFlush(schoolGroup);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Class code already exists');
      throw error;
    }
    return schoolGroup;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Class>> {
    return await this.schoolGroupRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: string): Promise<Class> {
    return await this.schoolGroupRepository.findOneOrFail({ id });
  }

  public async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const parent = updateClassDto.parentId
      ? await this.schoolGroupRepository.findOneOrFail({ id: updateClassDto.parentId })
      : null;

    const schoolGroup = await this.schoolGroupRepository.findOneOrFail({ id });

    wrap(schoolGroup).assign({ ...updateClassDto, ...(parent ? { parent } : {}) });
    await this.schoolGroupRepository.flush();
    return schoolGroup;
  }

  // TODO: differentiate soft from hard delete
  public async remove(id: string): Promise<void> {
    const schoolGroup = await this.schoolGroupRepository.findOneOrFail({ id });
    await this.schoolGroupRepository.removeAndFlush(schoolGroup);
  }
}
