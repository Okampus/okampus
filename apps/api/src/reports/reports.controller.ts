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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { Content } from '../contents/entities/content.entity';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { TypesenseEnabledGuard } from '../shared/lib/guards/typesense-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { SearchDto } from '../shared/modules/search/search.dto';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import type { IndexedReport } from './report-search.service';
import { ReportSearchService } from './report-search.service';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller({ path: 'reports' })
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly reportSearchService: ReportSearchService,
  ) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Report))
  public async findAllReports(
    @CurrentUser() user: User,
    @Body() filters: GetReportsDto,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<Report>> {
    return await this.reportsService.findAll(user, filters, normalizePagination(query));
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Report))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedReport> | SearchResponse<Report>> {
    if (full)
      return await this.reportSearchService.searchAndPopulate(query);
    return await this.reportSearchService.search(query);
  }

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Report, Content))
  public async createReport(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() createReportDto: CreateReportDto,
  ): Promise<Content> {
    return await this.reportsService.create(user, id, createReportDto);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Report))
  public async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Report> {
    return await this.reportsService.findOne(user, id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Report))
  public async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    return await this.reportsService.update(user, id, updateReportDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Report))
  public async remove(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.reportsService.remove(user, id);
  }
}
