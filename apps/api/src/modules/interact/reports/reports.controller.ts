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
import { Content } from '@create/contents/entities/content.entity';
import { CreateReportDto } from '@interact/reports/dto/create-report.dto';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { User } from '@uaa/users/user.entity';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller({ path: 'reports' })
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Report))
  public async findAll(
    @CurrentUser() user: User,
    @Body() filters: GetReportsDto,
    @Query() query: PaginationOptions,
  ): Promise<PaginatedNodes<Report>> {
    return await this.reportsService.findAll(user, filters, query);
  }

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Report, Content))
  public async create(
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
