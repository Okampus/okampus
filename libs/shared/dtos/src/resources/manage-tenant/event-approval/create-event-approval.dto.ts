import { EventApprovalProps } from './event-approval.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateEventApprovalDto extends EventApprovalProps {
  @Field(() => String)
  @IsString()
  stepId!: Snowflake;

  @Field(() => String)
  @IsString()
  eventId!: Snowflake;
}
