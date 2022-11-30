import {
  Args,
  Int,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { ApprovalStepType } from '@common/lib/types/enums/approval-step-type.enum';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { ApprovalStepDto } from '@modules/org/tenants/approval-steps/dto/create-approval-step.dto';
import { Tenant } from '../tenant.entity';
import { ApprovalStepsService } from './approval-steps.service';
import { UpdateApprovalStepDto } from './dto/update-approval-step.dto';

@Resolver(() => ApprovalStep)
export class ApprovalStepsResolver {
  constructor(private readonly approvalStepsService: ApprovalStepsService) {}

  // TODO: Add permission checks
  @Mutation(() => Tenant)
  public async addApprovalStep(@Args('createStep') createStep: ApprovalStepDto): Promise<ApprovalStep> {
    return await this.approvalStepsService.create(createStep);
  }

  // TODO: Add permission checks
  @Mutation(() => ApprovalStep)
  public async updateApprovalStep(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateStep') updateStep: UpdateApprovalStepDto,
  ): Promise<ApprovalStep> {
    return await this.approvalStepsService.update(id, updateStep);
  }

  @Mutation(() => [ApprovalStep])
  public async reinsertStep(
    @Args('step', { type: () => Int }) step: number,
    @Args('atStepNumber', { type: () => Int }) atStepNumber: number,
  ): Promise<ApprovalStep[]> {
    return await this.approvalStepsService.reinsertStep(step, atStepNumber, ApprovalStepType.Event);
  }
}
