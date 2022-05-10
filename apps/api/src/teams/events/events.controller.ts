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
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { normalizeSort } from '../../shared/modules/sorting';
import { User } from '../../users/user.entity';
import { CreateTeamEventDto } from './dto/create-team-event.dto';
import { ListTeamEventsDto } from './dto/list-team-events.dto';
import { UpdateTeamEventDto } from './dto/update-team-event.dto';
import { TeamEventsService } from './events.service';
import { TeamEvent } from './team-event.entity';

@ApiTags('Team Events')
@Controller()
export class TeamEventsController {
  constructor(
    private readonly eventsService: TeamEventsService,
  ) {}

  @Post(':teamId')
  @CheckPolicies(ability => ability.can(Action.Create, TeamEvent))
  public async create(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() createTeamEventDto: CreateTeamEventDto,
    @CurrentUser() user: User,
  ): Promise<TeamEvent> {
    return await this.eventsService.create(user, teamId, createTeamEventDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: ListTeamEventsDto,
  ): Promise<PaginatedResult<TeamEvent>> {
    return await this.eventsService.findAll(user, query, { ...normalizePagination(query), ...normalizeSort(query) });
  }

  @Get(':eventId')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ): Promise<TeamEvent> {
    return await this.eventsService.findOne(user, eventId);
  }

  @Patch(':eventId')
  @CheckPolicies(ability => ability.can(Action.Update, TeamEvent))
  public async update(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() updateTeamEventDto: UpdateTeamEventDto,
    @CurrentUser() user: User,
  ): Promise<TeamEvent> {
    return await this.eventsService.update(user, eventId, updateTeamEventDto);
  }

  @Delete(':eventId')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamEvent))
  public async remove(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.eventsService.remove(user, eventId);
  }
}
