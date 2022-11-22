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
import { CurrentTenant } from '@meta/shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@meta/shared/modules/authorization';
import { normalizePagination } from '@meta/shared/modules/pagination';
import type { PaginatedResult } from '@meta/shared/modules/pagination';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateTeamEventValidationDto } from '@modules/plan/event-validations/dto/create-team-event-validation.dto';
import { User } from '@modules/uua/users/user.entity';
// Import type { TeamEvent } from '../events/team-event.entity';
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
    @CurrentTenant() tenant: Tenant,
  ): Promise<TeamEventValidation> {
    return await this.eventValidationsService.create(tenant, user, id, createTeamEventValidationDto);
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
}
