import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ValidationStepType } from '@common/lib/types/enums/validation-step-type.enum';

@InputType()
export class CreateValidationStepDto {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  step: number;

  @Field()
  @Length(1, 100)
  @IsString()
  name: string;

  @Field(() => ValidationStepType)
  @IsEnum(ValidationStepType)
  type: ValidationStepType;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  users: string[];
}
