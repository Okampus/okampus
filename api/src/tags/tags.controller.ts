import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller({ path: 'tags' })
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Tag))
  public async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagsService.create(createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Tag))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Tag>> {
    if (query.page)
      return await this.tagsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.tagsService.findAll();
  }

  @Get(':name')
  @CheckPolicies(ability => ability.can(Action.Read, Tag))
  public async findOne(@Param('name') name: string): Promise<Tag | null> {
    return await this.tagsService.findOne(name);
  }

  @Patch(':name')
  @CheckPolicies(ability => ability.can(Action.Update, Tag))
  public async update(@Param('name') name: string, @Body() updateTagDto: UpdateTagDto): Promise<Tag> {
    return await this.tagsService.update(name, updateTagDto);
  }

  @Delete(':name')
  @CheckPolicies(ability => ability.can(Action.Delete, Tag))
  public async remove(@Param('name') name: string): Promise<void> {
    await this.tagsService.remove(name);
  }
}
