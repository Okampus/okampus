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
import { DailyInfo } from './daily-info.entity';
import { DailyInfoService } from './daily-info.service';
import { CreateDailyInfoDto } from './dto/create-daily-info.dto';
import { UpdateDailyInfoDto } from './dto/update-daily-info.dto';

@ApiTags('DailyInfo')
@Controller()
export class DailyInfoController {
  constructor(
    private readonly dailyInfoService: DailyInfoService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, DailyInfo))
  public async create(@Body() createDailyInfoDto: CreateDailyInfoDto): Promise<DailyInfo> {
    return await this.dailyInfoService.create({
      ...createDailyInfoDto,
      date: new Date(createDailyInfoDto.date),
    });
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, DailyInfo))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<DailyInfo>> {
    return await this.dailyInfoService.findAll(normalizePagination(query));
  }

  @Get(':date')
  @CheckPolicies(ability => ability.can(Action.Read, DailyInfo))
  public async findOne(@Param('date', ParseDatePipe) date: Date): Promise<DailyInfo> {
    return await this.dailyInfoService.findOne(date);
  }

  @Patch(':date')
  @CheckPolicies(ability => ability.can(Action.Update, DailyInfo))
  public async update(
    @Param('date', ParseDatePipe) date: Date,
    @Body() updateDailyInfoDto: UpdateDailyInfoDto,
  ): Promise<DailyInfo> {
    return await this.dailyInfoService.update(date, updateDailyInfoDto);
  }

  @Delete(':date')
  @CheckPolicies(ability => ability.can(Action.Delete, DailyInfo))
  public async remove(@Param('date', ParseDatePipe) date: Date): Promise<void> {
    await this.dailyInfoService.remove(date);
  }
}
