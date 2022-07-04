import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import { CreateTeamEventRegistrationDto } from './dto/create-team-event-registration.dto';
import { ListRegisteredEventsDto } from './dto/list-registered-events.dto';
import { TeamEventRegistrationsService } from './event-registrations.service';
import type { TeamEventRegistration } from './team-event-registration.entity';

@ApiTags('Team Event Registrtations')
@Controller()
export class TeamEventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: TeamEventRegistrationsService,
  ) {}

  @Post(':eventId')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async create(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() createTeamEventRegistrationDto: CreateTeamEventRegistrationDto,
    @CurrentUser() user: User,
  ): Promise<TeamEventRegistration> {
    return await this.eventRegistrationsService.create(user, eventId, createTeamEventRegistrationDto);
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

  @Get(':registrationId')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async findOne(
    @Param('registrationId', ParseIntPipe) registrationId: number,
    @CurrentUser() user: User,
  ): Promise<TeamEventRegistration> {
    return await this.eventRegistrationsService.findOne(user, registrationId);
  }

  @Delete(':registrationId')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEvent))
  public async remove(
    @Param('registrationId', ParseIntPipe) registrationId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.eventRegistrationsService.remove(user, registrationId);
  }
}
