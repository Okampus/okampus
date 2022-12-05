import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import type { PaginatedNodes, PaginationArgs } from '@common/modules/pagination';
import type { CreateTagDto } from '@modules/catalog/tags/dto/create-tag.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = new Tag(createTagDto);
    try {
      await this.tagRepository.persistAndFlush(tag);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Tag name already exists');
      throw error;
    }
    return tag;
  }

  public async findAll(paginationOptions?: PaginationArgs): Promise<PaginatedNodes<Tag>> {
    return await this.tagRepository.findWithPagination(paginationOptions);
  }

  public async findOne(name: string): Promise<Tag> {
    return await this.tagRepository.findOneOrFail({ name });
  }

  public async update(name: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOneOrFail({ name });

    wrap(tag).assign(updateTagDto);
    await this.tagRepository.flush();
    return tag;
  }

  public async remove(name: string): Promise<void> {
    const tag = await this.tagRepository.findOneOrFail({ name });
    await this.tagRepository.removeAndFlush(tag);
  }
}
