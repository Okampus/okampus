import {
  Args,
  Int,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { ApprovalStepDto } from '@modules/org/tenants/approval-steps/dto/create-approval-step.dto';
import { Tenant } from '../tenant.entity';
import { TenantsService } from '../tenants.service';
import { ApprovalStepsService } from './approval-steps.service';
import { UpdateApprovalStepDto } from './dto/update-approval-step.dto';

@Resolver(() => ApprovalStep)
export class ApprovalStepsResolver {
  constructor(
    private readonly approvalStepsService: ApprovalStepsService,
    private readonly tenantsService: TenantsService,
  ) {}

  // TODO: Add permission checks
  @Mutation(() => Tenant)
  public async addApprovalStep(
    @CurrentTenant() tenant: Tenant,
    @Args('createStep') createStep: ApprovalStepDto,
  ): Promise<Tenant> {
    await this.approvalStepsService.create(tenant, createStep);
    return tenant;
  }

  // TODO: Add permission checks
  @Mutation(() => ApprovalStep)
  public async updateApprovalStep(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateStep') updateStep: UpdateApprovalStepDto,
  ): Promise<ApprovalStep> {
    return await this.approvalStepsService.update(id, updateStep);
  }

  @Mutation(() => Tenant)
  public async insertStep(
    @CurrentTenant() tenant: Tenant,
    @Args('step', { type: () => Int }) step: number,
    @Args('atStep', { type: () => Int }) atStep: number,
  ): Promise<Tenant> {
    return await this.approvalStepsService.insertStep(tenant, step, atStep);
  }
}
