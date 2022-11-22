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
import { Action, CheckPolicies } from '@meta/shared/modules/authorization';
import { normalizePagination, PaginateDto } from '@meta/shared/modules/pagination';
import type { PaginatedResult } from '@meta/shared/modules/pagination';
import { CreateClassDto } from '@modules/org/classes/dto/create-class.dto';
import { Class } from './class.entity';
import { ClassesService } from './class.service';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('Classes')
@Controller()
export class ClassesController {
  constructor(
    private readonly schoolGroupsService: ClassesService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Class))
  public async create(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return await this.schoolGroupsService.create(createClassDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Class>> {
    return await this.schoolGroupsService.findAll(normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findOne(@Param('id') id: string): Promise<Class> {
    return await this.schoolGroupsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto): Promise<Class> {
    return await this.schoolGroupsService.update(id, updateClassDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Class))
  public async remove(@Param('id') id: string): Promise<void> {
    await this.schoolGroupsService.remove(id);
  }
}
