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
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import type { PaginatedNodes } from '@common/modules/pagination';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateEventApprovalDto } from '@modules/plan/approvals/dto/create-approval.dto';
import { User } from '@modules/uaa/users/user.entity';
// Import type { Event } from '../events/team-event.entity';
import { EventApproval } from './approval.entity';
import { EventApprovalsService } from './approvals.service';
import { ListEventApprovalsDto } from './dto/list-approvals.dto';

@ApiTags('Event Approvals')
@Controller()
export class EventApprovalsController {
  constructor(
    private readonly eventValidationsService: EventApprovalsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, EventApproval))
  public async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createEventValidationDto: CreateEventApprovalDto,
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
  ): Promise<EventApproval> {
    return await this.eventValidationsService.create(tenant, user, id, createEventValidationDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, EventApproval))
  public async findAll(
    @Query() query: ListEventApprovalsDto,
  ): Promise<PaginatedNodes<EventApproval>> {
    return await this.eventValidationsService.findAll(query, query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, EventApproval))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EventApproval[]> {
    return await this.eventValidationsService.findOne(id);
  }
}
