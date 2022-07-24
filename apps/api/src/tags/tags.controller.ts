import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { TypesenseEnabledGuard } from '../shared/lib/guards/typesense-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { SearchDto } from '../shared/modules/search/search.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagSearchService } from './tag-search.service';
import type { IndexedTag } from './tag-search.service';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller({ path: 'tags' })
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly tagSearchService: TagSearchService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Tag))
  public async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagsService.create(createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Tag))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Tag>> {
    return await this.tagsService.findAll(normalizePagination(query));
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Tag))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedTag> | SearchResponse<Tag>> {
    if (full)
      return await this.tagSearchService.searchAndPopulate(query);
    return await this.tagSearchService.search(query);
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
