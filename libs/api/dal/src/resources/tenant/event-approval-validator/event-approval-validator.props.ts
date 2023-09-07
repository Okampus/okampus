import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class EventApprovalValidatorProps {
  @Field(() => Boolean)
  @IsOptional()
  canValidate?: boolean;

  @Field(() => Boolean)
  @IsOptional()
  isNotified?: boolean;
}
