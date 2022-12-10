import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { CreateLabelDto } from '@catalog/labels/dto/create-label.dto';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { BaseRepository } from '@lib/orm/base.repository';
import type { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './label.entity';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label) private readonly labelRepository: BaseRepository<Label>,
  ) {}

  public async create(createLabelDto: CreateLabelDto): Promise<Label> {
    const label = new Label(createLabelDto);
    try {
      await this.labelRepository.persistAndFlush(label);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Label id/slug already exists');
      throw error;
    }
    return label;
  }

  public async findAll(
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedNodes<Label>> {
    return await this.labelRepository.findWithPagination(paginationOptions);
  }

  public async findOne(id: string): Promise<Label> {
    return await this.labelRepository.findOneOrFail({ id });
  }

  public async update(
    id: string,
    updateLabelDto: UpdateLabelDto,
  ): Promise<Label> {
    const label = await this.labelRepository.findOneOrFail({ id });

    wrap(label).assign(updateLabelDto);
    await this.labelRepository.flush();
    return label;
  }

  public async remove(id: string): Promise<void> {
    const label = await this.labelRepository.findOneOrFail({ id });
    await this.labelRepository.removeAndFlush(label);
  }
}
