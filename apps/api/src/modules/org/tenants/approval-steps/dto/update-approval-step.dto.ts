import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { ApprovalStepDto } from '@tenants/approval-steps/dto/create-approval-step.dto';

@InputType()
export class UpdateApprovalStepDto extends PartialType(OmitType(ApprovalStepDto, ['step'])) {}
