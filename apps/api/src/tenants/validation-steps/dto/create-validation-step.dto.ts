import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ValidationStepType } from '../../../shared/lib/types/enums/validation-step-type.enum';

export class CreateValidationStepDto {
  @IsInt()
  @Min(1)
  step: number;

  @Length(1, 100)
  @IsString()
  name: string;

  @IsEnum(ValidationStepType)
  type: ValidationStepType;

  @IsArray()
  @IsString({ each: true })
  users: string[];
}
