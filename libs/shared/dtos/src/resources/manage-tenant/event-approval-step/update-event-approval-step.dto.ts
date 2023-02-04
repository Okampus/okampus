import { CreateEventApprovalStepDto } from './create-event-approval-step.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateEventApprovalStepDto extends PartialType(CreateEventApprovalStepDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
