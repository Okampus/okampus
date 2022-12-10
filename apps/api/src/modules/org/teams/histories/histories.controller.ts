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
import { CreateHistoryDto } from '@teams/histories/dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { HistoriesService } from './histories.service';
import { TeamHistory } from './team-history.entity';

@ApiTags('Histories')
@Controller()
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, TeamHistory))
  public async create(@Body() createHistoryDto: CreateHistoryDto): Promise<TeamHistory> {
    return await this.historiesService.create(createHistoryDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamHistory))
  public async findAll(@Query() query: PaginationOptions): Promise<PaginatedNodes<TeamHistory>> {
    return await this.historiesService.findAll(query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamHistory))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<TeamHistory> {
    return await this.historiesService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamHistory))
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateHistoryDto: UpdateHistoryDto): Promise<TeamHistory> {
    return await this.historiesService.update(id, updateHistoryDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamHistory))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.historiesService.remove(id);
  }
}
