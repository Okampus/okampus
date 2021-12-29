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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Action, CheckPolicies, PoliciesGuard } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';

@ApiTags('Subjects')
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Subject))
  public async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Subject))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Subject>> {
    if (query.page)
      return await this.subjectsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.subjectsService.findAll();
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
