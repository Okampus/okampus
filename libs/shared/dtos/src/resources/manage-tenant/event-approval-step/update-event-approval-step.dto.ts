import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { CreateEventApprovalStepDto } from './create-event-approval-step.dto';

@InputType()
export class UpdateEventApprovalStepDto extends PartialType(CreateEventApprovalStepDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
