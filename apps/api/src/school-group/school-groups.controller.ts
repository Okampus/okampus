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
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { CreateSchoolGroupDto } from './dto/create-school-group.dto';
import { UpdateSchoolGroupDto } from './dto/update-school-group.dto';
import { SchoolGroup } from './school-group.entity';
import { SchoolGroupsService } from './school-groups.service';

@ApiTags('SchoolGroups')
@Controller({ path: 'school-groups' })
export class SchoolGroupsController {
  constructor(
    private readonly schoolGroupsService: SchoolGroupsService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, SchoolGroup))
  public async create(@Body() createSchoolGroupDto: CreateSchoolGroupDto): Promise<SchoolGroup> {
    return await this.schoolGroupsService.create(createSchoolGroupDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, SchoolGroup))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<SchoolGroup>> {
    return await this.schoolGroupsService.findAll(normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, SchoolGroup))
  public async findOne(@Param('id') id: number): Promise<SchoolGroup> {
    return await this.schoolGroupsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, SchoolGroup))
  public async update(@Param('id') id: number, @Body() updateSchoolGroupDto: UpdateSchoolGroupDto): Promise<SchoolGroup> {
    return await this.schoolGroupsService.update(id, updateSchoolGroupDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, SchoolGroup))
  public async remove(@Param('id') id: number): Promise<void> {
    await this.schoolGroupsService.remove(id);
  }
}
