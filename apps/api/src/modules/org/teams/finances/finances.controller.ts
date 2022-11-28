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
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { normalizePagination } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { CreateTeamFinanceDto } from '@modules/org/teams/finances/dto/create-team-finance.dto';
import { User } from '@modules/uaa/users/user.entity';
import { ListTeamFinancesDto } from './dto/list-team-finances.dto';
import { UpdateTeamFinanceDto } from './dto/update-team-finance.dto';
import { TeamFinancesService } from './finances.service';
import { TeamFinance } from './team-finance.entity';

@ApiTags('Team Finances')
@Controller()
export class TeamFinancesController {
  constructor(
    private readonly teamFinancesService: TeamFinancesService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, TeamFinance))
  public async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTeamFinanceDto: CreateTeamFinanceDto,
    @CurrentUser() user: User,
  ): Promise<TeamFinance> {
    return await this.teamFinancesService.create(user, id, createTeamFinanceDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamFinance))
  public async findAll(
    @Query() query: ListTeamFinancesDto,
  ): Promise<PaginatedResult<TeamFinance>> {
    return await this.teamFinancesService.findAll(query, normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamFinance))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TeamFinance> {
    return await this.teamFinancesService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamFinance))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamFinanceDto: UpdateTeamFinanceDto,
    @CurrentUser() user: User,
  ): Promise<TeamFinance> {
    return await this.teamFinancesService.update(user, id, updateTeamFinanceDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamFinance))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamFinancesService.remove(user, id);
  }
}
