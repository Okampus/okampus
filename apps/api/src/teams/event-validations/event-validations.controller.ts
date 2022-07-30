import {
  Body,
  Controller,
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
import type { TeamEvent } from '../events/team-event.entity';
import { CreateTeamEventValidationDto } from './dto/create-team-event-validation.dto';
import { ListTeamEventValidationsDto } from './dto/list-team-event-validations.dto';
import { TeamEventValidationsService } from './event-validations.service';
import { TeamEventValidation } from './team-event-validation.entity';

@ApiTags('Team Event Validations')
@Controller()
export class TeamEventValidationsController {
  constructor(
    private readonly eventValidationsService: TeamEventValidationsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, TeamEventValidation))
  public async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createTeamEventValidationDto: CreateTeamEventValidationDto,
    @CurrentUser() user: User,
  ): Promise<TeamEventValidation> {
    return await this.eventValidationsService.create(user, id, createTeamEventValidationDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamEventValidation))
  public async findAll(
    @Query() query: ListTeamEventValidationsDto,
  ): Promise<PaginatedResult<TeamEventValidation>> {
    return await this.eventValidationsService.findAll(query, normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEventValidation))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TeamEventValidation[]> {
    return await this.eventValidationsService.findOne(id);
  }

  @Get('/remaining/my-events')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEventValidation))
  public async findMyEvents(
    @CurrentUser() user: User,
  ): Promise<PaginatedResult<TeamEvent>> {
    return await this.eventValidationsService.findMyEvents(user);
  }

  @Get('/remaining/for-event/:id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamEventValidation))
  public async findValidationsLeftForEvent(
    @Param('id', ParseIntPipe) id: number,
  ): ReturnType<TeamEventValidationsService['findValidationsLeftForEvent']> {
    return await this.eventValidationsService.findValidationsLeftForEvent(id);
  }
}