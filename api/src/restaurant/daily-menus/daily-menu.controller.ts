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
import { ParseDatePipe } from '../../shared/lib/pipes/parse-date.pipe';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination/normalize-pagination';
import { PaginateDto } from '../../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { DailyMenu } from './daily-menu.entity';
import { DailyMenusService } from './daily-menu.service';
import { CreateDailyMenuDto } from './dto/create-daily-menu.dto';
import { UpdateDailyMenuDto } from './dto/update-daily-menu.dto';

@ApiTags('DailyMenu')
@Controller()
export class DailyMenusController {
  constructor(
    private readonly dailyMenuService: DailyMenusService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, DailyMenu))
  public async create(@Body() createDailyMenuDto: CreateDailyMenuDto): Promise<DailyMenu> {
    return await this.dailyMenuService.create({
      ...createDailyMenuDto,
      date: new Date(createDailyMenuDto.date),
    });
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, DailyMenu))
  public async findAll(
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<DailyMenu>> {
    return await this.dailyMenuService.findAll(normalizePagination(query));
  }

  @Get(':date')
  @CheckPolicies(ability => ability.can(Action.Read, DailyMenu))
  public async findOne(@Param('date', ParseDatePipe) date: Date): Promise<DailyMenu> {
    return await this.dailyMenuService.findOne(date);
  }

  @Patch(':date')
  @CheckPolicies(ability => ability.can(Action.Update, DailyMenu))
  public async update(
    @Param('date', ParseDatePipe) date: Date,
    @Body() updateDailyMenuDto: UpdateDailyMenuDto,
  ): Promise<DailyMenu> {
    return await this.dailyMenuService.update(date, updateDailyMenuDto);
  }

  @Delete(':date')
  @CheckPolicies(ability => ability.can(Action.Delete, DailyMenu))
  public async remove(@Param('date', ParseDatePipe) date: Date): Promise<void> {
    await this.dailyMenuService.remove(date);
  }
}
