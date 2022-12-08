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
import { PaginationArgs } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CreateClassDto } from '@modules/org/classes/dto/create-class.dto';
import { Class } from './class.entity';
import { ClassesService } from './class.service';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('Classes')
@Controller()
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Class))
  public async create(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return await this.classesService.create(createClassDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findAll(@Query() query: PaginationArgs): Promise<PaginatedNodes<Class>> {
    return await this.classesService.findAll(query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findOne(@Param('id') id: string): Promise<Class> {
    return await this.classesService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto): Promise<Class> {
    return await this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Class))
  public async remove(@Param('id') id: string): Promise<void> {
    await this.classesService.remove(id);
  }
}
