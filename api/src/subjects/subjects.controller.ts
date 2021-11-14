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
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import type { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  public async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectsService.create(createSubjectDto);
  }

  @Get()
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Subject>> {
    if (query.page)
      return await this.subjectsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.subjectsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Subject> {
    return await this.subjectsService.findOne(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    return await this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    await this.subjectsService.remove(id);
  }
}
