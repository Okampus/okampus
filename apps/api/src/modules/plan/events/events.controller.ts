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
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { normalizePagination } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { normalizeSort } from '@common/modules/sorting';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateEventDto } from '@modules/plan/events/dto/create-event.dto';
import { User } from '@modules/uua/users/user.entity';
import { ListEventsDto } from './dto/list-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller()
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, Event))
  public async create(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.create(tenant, user, id, createEventDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Event))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: ListEventsDto,
  ): Promise<PaginatedResult<Event>> {
    return await this.eventsService.findAll(user, query, { ...normalizePagination(query), ...normalizeSort(query) });
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Event))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.findOne(user, id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Event))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
  ): Promise<Event> {
    return await this.eventsService.update(tenant, user, id, updateEventDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Event))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.eventsService.remove(user, id);
  }
}
