import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GqlFriendlyService } from '@common/lib/helpers/gql-friendly-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import type { CreateClassDto } from '@modules/org/classes/dto/create-class.dto';
import { Class } from './class.entity';
import type { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService extends GqlFriendlyService {
  constructor(@InjectRepository(Class) private readonly classRepository: BaseRepository<Class>) { super(); }

  public async create(createClassDto: CreateClassDto): Promise<Class> {
    const parent = createClassDto.parentId
      ? await this.classRepository.findOneOrFail({ id: createClassDto.parentId }, { populate: this.autoGqlPopulate() })
      : null;

    const schoolClass = new Class({
      ...createClassDto,
      parent,
    });

    try {
      await this.classRepository.persistAndFlush(schoolClass);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Class code already exists');
      throw error;
    }
    return schoolClass;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Class>> {
    return await this.classRepository.findWithPagination(paginationOptions, {}, { populate: this.autoGqlPopulate() });
  }

  public async findOne(id: string): Promise<Class> {
    this.autoGqlPopulate();
    return await this.classRepository.findOneOrFail({ id }, { populate: this.autoGqlPopulate() });
  }

  public async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const parent = updateClassDto.parentId
      ? await this.classRepository.findOneOrFail({ id: updateClassDto.parentId }, { populate: this.autoGqlPopulate() })
      : null;

    const schoolClass = await this.classRepository.findOneOrFail({ id }, { populate: this.autoGqlPopulate() });

    wrap(schoolClass).assign({ ...updateClassDto, ...(parent ? { parent } : {}) });
    await this.classRepository.flush();
    return schoolClass;
  }

  // TODO: differentiate soft from hard delete
  public async remove(id: string): Promise<void> {
    const schoolClass = await this.classRepository.findOneOrFail({ id }, { populate: this.autoGqlPopulate() });
    await this.classRepository.removeAndFlush(schoolClass);
  }
}
