import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateValidationStepDto } from '@modules/org/tenants/validation-steps/dto/create-validation-step.dto';

@InputType()
export class UpdateValidationStepDto extends PartialType(OmitType(CreateValidationStepDto, ['step'])) {}
