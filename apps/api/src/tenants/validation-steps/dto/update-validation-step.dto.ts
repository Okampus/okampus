import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateValidationStepDto } from './create-validation-step.dto';

@InputType()
export class UpdateValidationStepDto extends PartialType(OmitType(CreateValidationStepDto, ['step'])) {}
