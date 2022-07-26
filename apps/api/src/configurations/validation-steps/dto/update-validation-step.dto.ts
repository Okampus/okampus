import { PartialType } from '@nestjs/mapped-types';
import { CreateValidationStepDto } from './create-validation-step.dto';

export class UpdateValidationStepDto extends PartialType(CreateValidationStepDto) {}
