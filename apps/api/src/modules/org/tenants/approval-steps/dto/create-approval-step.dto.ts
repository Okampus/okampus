import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ApprovalStepType } from '@common/lib/types/enums/approval-step-type.enum';

@InputType()
export class ApprovalStepDto {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  step: number;

  @Field()
  @Length(1, 100)
  @IsString()
  name: string;

  @Field(() => ApprovalStepType)
  @IsEnum(ApprovalStepType)
  type: ApprovalStepType;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  users: string[];
}