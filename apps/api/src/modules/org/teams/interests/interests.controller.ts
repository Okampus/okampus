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
import { Action, CheckPolicies } from '@meta/shared/modules/authorization';
import { normalizePagination, PaginateDto } from '@meta/shared/modules/pagination';
import type { PaginatedResult } from '@meta/shared/modules/pagination';
import { CreateInterestDto } from '@modules/org/teams/interests/dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Interest } from './interest.entity';
import { InterestsService } from './interests.service';

@ApiTags('Interests')
@Controller({ path: 'interests' })
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Interest))
  public async create(@Body() createInterestDto: CreateInterestDto): Promise<Interest> {
    return await this.interestsService.create(createInterestDto);
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
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateInterestDto: UpdateInterestDto): Promise<Interest> {
    return await this.interestsService.update(id, updateInterestDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Interest))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.interestsService.remove(id);
  }
}
