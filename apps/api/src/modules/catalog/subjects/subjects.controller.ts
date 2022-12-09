import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { PaginationOptions } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CreateSubjectDto } from '@modules/catalog/subjects/dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';

@ApiTags('Subjects')
@Controller({ path: 'subjects' })
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Subject))
  public async create(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<Subject> {
    return await this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Subject))
  public async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedNodes<Subject>> {
    return await this.subjectsService.findAll(query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Subject))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Subject> {
    return await this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Subject))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return await this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Subject))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.subjectsService.remove(id);
  }
}
