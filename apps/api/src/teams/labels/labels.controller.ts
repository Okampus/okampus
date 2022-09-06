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
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelsService } from './labels.service';
import { TeamLabel } from './team-label.entity';

@ApiTags('Labels')
@Controller()
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, TeamLabel))
  public async create(@Body() createLabelDto: CreateLabelDto): Promise<TeamLabel> {
    return await this.labelsService.create(createLabelDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamLabel))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<TeamLabel>> {
    return await this.labelsService.findAll(normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamLabel))
  public async findOne(@Param('id', ParseIntPipe) id: string): Promise<TeamLabel> {
    return await this.labelsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamLabel))
  public async update(@Param('id', ParseIntPipe) id: string, @Body() updateLabelDto: UpdateLabelDto): Promise<TeamLabel> {
    return await this.labelsService.update(id, updateLabelDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamLabel))
  public async remove(@Param('id', ParseIntPipe) id: string): Promise<void> {
    await this.labelsService.remove(id);
  }
}
