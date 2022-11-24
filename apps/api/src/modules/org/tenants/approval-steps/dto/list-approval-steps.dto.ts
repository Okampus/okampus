import { IsEnum } from 'class-validator';
import { ApprovalStepType } from '@common/lib/types/enums/approval-step-type.enum';

export class ListApprovalStepsDto {
  @IsEnum(ApprovalStepType)
  type: ApprovalStepType;
}
