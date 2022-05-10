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
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectSearchService } from './subject-search.service';
import type { IndexedSubject } from './subject-search.service';
import { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';

@ApiTags('Subjects')
@Controller({ path: 'subjects' })
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly subjectSearchService: SubjectSearchService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Subject))
  public async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Subject))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Subject>> {
    return await this.subjectsService.findAll(normalizePagination(query));
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Subject))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedSubject> | SearchResponse<Subject>> {
    if (full)
      return await this.subjectSearchService.searchAndPopulate(query);
    return await this.subjectSearchService.search(query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Subject))
  public async findOne(@Param('id') id: string): Promise<Subject> {
    return await this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Subject))
  public async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    return await this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Subject))
  public async remove(@Param('id') id: string): Promise<void> {
    await this.subjectsService.remove(id);
  }
}
