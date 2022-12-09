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
import { Action, CheckPolicies } from '@common/modules/authorization';
import { PaginationOptions } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CreateSchoolYearDto } from '@modules/org/classes/school-year/dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYear } from './school-year.entity';
import { SchoolYearsService } from './school-years.service';

@ApiTags('SchoolYears')
@Controller({ path: 'school-years' })
export class SchoolYearsController {
  constructor(
    private readonly schoolYearsService: SchoolYearsService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, SchoolYear))
  public async create(@Body() createSchoolYearDto: CreateSchoolYearDto): Promise<SchoolYear> {
    return await this.schoolYearsService.create(createSchoolYearDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, SchoolYear))
  public async findAll(@Query() query: PaginationOptions): Promise<PaginatedNodes<SchoolYear>> {
    return await this.schoolYearsService.findAll(query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, SchoolYear))
  public async findOne(@Param('id') id: string): Promise<SchoolYear> {
    return await this.schoolYearsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, SchoolYear))
  public async update(@Param('id') id: string, @Body() updateSchoolYearDto: UpdateSchoolYearDto): Promise<SchoolYear> {
    return await this.schoolYearsService.update(id, updateSchoolYearDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, SchoolYear))
  public async remove(@Param('id') id: string): Promise<void> {
    await this.schoolYearsService.remove(id);
  }
}
