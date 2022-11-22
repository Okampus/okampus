import { IsEnum } from 'class-validator';
import { ValidationStepType } from '@meta/shared/lib/types/enums/validation-step-type.enum';

export class ListValidationStepsDto {
  @IsEnum(ValidationStepType)
  type: ValidationStepType;
}
