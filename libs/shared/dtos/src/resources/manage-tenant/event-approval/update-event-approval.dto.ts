import { CreateEventApprovalDto } from './create-event-approval.dto';
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateEventApprovalDto extends PartialType(OmitType(CreateEventApprovalDto, ['stepId'])) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
