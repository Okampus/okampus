import {
  BadRequestException,
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
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@meta/shared/modules/authorization';
import { normalizePagination } from '@meta/shared/modules/pagination';
import type { PaginatedResult } from '@meta/shared/modules/pagination';
import { CreateTeamEventRegistrationDto } from '@modules/plan/event-registrations/dto/create-team-event-registration.dto';
import { User } from '@modules/uua/users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import { ListRegisteredEventsDto } from './dto/list-registered-events.dto';
import { UpdateTeamEventRegistrationDto } from './dto/update-team-event-registration.dto';
import { TeamEventRegistrationsService } from './event-registrations.service';
import type { TeamEventRegistration } from './team-event-registration.entity';

@ApiTags('Team Event Registrtations')
@Controller()
export class TeamEventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: TeamEventRegistrationsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTeamEventRegistrationDto: CreateTeamEventRegistrationDto,
    @CurrentUser() user: User,
  ): Promise<TeamEventRegistration> {
    return await this.eventRegistrationsService.create(user, id, createTeamEventRegistrationDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: ListRegisteredEventsDto,
  ): Promise<PaginatedResult<TeamEventRegistration>> {
    if (!query.eventId && !query.userId)
      throw new BadRequestException('Invalid filter query');

    return await this.eventRegistrationsService.findAll(user, query, normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<TeamEventRegistration> {
    return await this.eventRegistrationsService.findOne(user, id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamEventRegistrationDto: UpdateTeamEventRegistrationDto,
    @CurrentUser() user: User,
  ): Promise<TeamEventRegistration> {
    return await this.eventRegistrationsService.update(user, id, updateTeamEventRegistrationDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.eventRegistrationsService.remove(user, id);
  }
}
