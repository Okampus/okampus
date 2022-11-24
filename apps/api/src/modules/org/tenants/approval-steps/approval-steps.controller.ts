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
import { Action, CheckPolicies } from '@common/modules/authorization';
import { ApprovalStepsService } from '@modules/org/tenants/approval-steps/approval-steps.service';
import { ApprovalStepDto } from '@modules/org/tenants/approval-steps/dto/create-approval-step.dto';
import { Tenant } from '../tenant.entity';
import { ApprovalStep } from './approval-step.entity';
import { ListApprovalStepsDto } from './dto/list-approval-steps.dto';
import { UpdateApprovalStepDto } from './dto/update-approval-step.dto';

@ApiTags('Approval Steps')
@Controller()
export class ApprovalStepsController {
  constructor(
    private readonly approvalStepsService: ApprovalStepsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, ApprovalStep))
  public async create(
    @CurrentTenant() tenant: Tenant,
    @Body() createApprovalStepDto: ApprovalStepDto,
  ): Promise<ApprovalStep> {
    return await this.approvalStepsService.create(tenant, createApprovalStepDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, ApprovalStep))
  public async findAll(
    @CurrentTenant() tenant: Tenant,
    @Query() query: ListApprovalStepsDto,
  ): Promise<ApprovalStep[]> {
    return await this.approvalStepsService.findAll(tenant, query.type);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, ApprovalStep))
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateApprovalStepDto: UpdateApprovalStepDto): Promise<ApprovalStep> {
    return await this.approvalStepsService.update(id, updateApprovalStepDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, ApprovalStep))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.approvalStepsService.remove(id);
  }

  @Post(':id/users/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, ApprovalStep))
  public async addUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
  ): Promise<ApprovalStep> {
    return await this.approvalStepsService.addUser(id, userId);
  }

  @Delete(':id/users/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, ApprovalStep))
  public async removeUser(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.approvalStepsService.removeUser(tenant, id, userId);
  }
}
