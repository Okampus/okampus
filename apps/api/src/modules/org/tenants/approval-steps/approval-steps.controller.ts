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
import { Action, CheckPolicies } from '@common/modules/authorization';
import { CurrentTenant } from '@lib/decorators/current-tenant.decorator';
import { ApprovalStepsService } from '@tenants/approval-steps/approval-steps.service';
import { ApprovalStepDto } from '@tenants/approval-steps/dto/create-approval-step.dto';
import { Tenant } from '@tenants/tenant.entity';
import { ApprovalStep } from './approval-step.entity';
import { ListApprovalStepsDto } from './dto/list-approval-steps.dto';
import { UpdateApprovalStepDto } from './dto/update-approval-step.dto';

@ApiTags('Approval Steps')
@Controller()
export class ApprovalStepsController {
  constructor(private readonly approvalStepsService: ApprovalStepsService) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, ApprovalStep))
  public async create(@Body() createApprovalStepDto: ApprovalStepDto): Promise<ApprovalStep> {
    return await this.approvalStepsService.create(createApprovalStepDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, ApprovalStep))
  public async findAll(@Query() query: ListApprovalStepsDto): Promise<ApprovalStep[]> {
    return await this.approvalStepsService.findAll(query.type);
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

  @Post(':stepId/users/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, ApprovalStep))
  public async addUser(
    @Param('stepId', ParseIntPipe) stepId: number,
    @Param('userId') userId: string,
  ): Promise<ApprovalStep> {
    return await this.approvalStepsService.addUser(stepId, userId);
  }

  @Delete(':stepId/users/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, ApprovalStep))
  public async removeUser(
    @CurrentTenant() tenant: Tenant,
    @Param('stepId', ParseIntPipe) stepId: number,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.approvalStepsService.removeUser(stepId, userId);
  }
}
