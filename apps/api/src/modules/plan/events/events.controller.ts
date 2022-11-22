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
import { CurrentTenant } from '@meta/shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@meta/shared/modules/authorization';
import { normalizePagination } from '@meta/shared/modules/pagination';
import type { PaginatedResult } from '@meta/shared/modules/pagination';
import { normalizeSort } from '@meta/shared/modules/sorting';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateTeamEventDto } from '@modules/plan/events/dto/create-team-event.dto';
import { User } from '@modules/uua/users/user.entity';
import { ListTeamEventsDto } from './dto/list-team-events.dto';
import { UpdateTeamEventDto } from './dto/update-team-event.dto';
import { TeamEventsService } from './events.service';
import { TeamEvent } from './team-event.entity';

@ApiTags('Events')
@Controller()
export class TeamEventsController {
  constructor(
    private readonly eventsService: TeamEventsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, TeamEvent))
  public async create(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Body() createTeamEventDto: CreateTeamEventDto,
    @CurrentUser() user: User,
  ): Promise<TeamEvent> {
    return await this.eventsService.create(tenant, user, id, createTeamEventDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: ListTeamEventsDto,
  ): Promise<PaginatedResult<TeamEvent>> {
    return await this.eventsService.findAll(user, query, { ...normalizePagination(query), ...normalizeSort(query) });
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<TeamEvent> {
    return await this.eventsService.findOne(user, id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamEvent))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamEventDto: UpdateTeamEventDto,
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
  ): Promise<TeamEvent> {
    return await this.eventsService.update(tenant, user, id, updateTeamEventDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamEvent))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.eventsService.remove(user, id);
  }
}
