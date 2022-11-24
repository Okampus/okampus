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
import { normalizePagination, PaginateDto } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { CreateLabelDto } from '@modules/catalog/labels/dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './label.entity';
import { LabelsService } from './labels.service';

@ApiTags('Labels')
@Controller()
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Label))
  public async create(@Body() createLabelDto: CreateLabelDto): Promise<Label> {
    return await this.labelsService.create(createLabelDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Label))
  public async findAll(
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<Label>> {
    return await this.labelsService.findAll(normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Label))
  public async findOne(@Param('id', ParseIntPipe) id: string): Promise<Label> {
    return await this.labelsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Label))
  public async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateLabelDto: UpdateLabelDto,
  ): Promise<Label> {
    return await this.labelsService.update(id, updateLabelDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Label))
  public async remove(@Param('id', ParseIntPipe) id: string): Promise<void> {
    await this.labelsService.remove(id);
  }
}
