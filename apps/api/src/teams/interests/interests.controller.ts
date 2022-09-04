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
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Interest } from './interest.entity';
import { InterestsService } from './interests.service';

@ApiTags('Interests')
@Controller()
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Interest))
  public async create(@Body() createHistoryDto: CreateInterestDto): Promise<Interest> {
    return await this.interestsService.create(createHistoryDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Interest))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Interest>> {
    return await this.interestsService.findAll(normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Interest))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Interest> {
    return await this.interestsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Interest))
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateSubjectDto: UpdateInterestDto): Promise<Interest> {
    return await this.interestsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Interest))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.interestsService.remove(id);
  }
}
