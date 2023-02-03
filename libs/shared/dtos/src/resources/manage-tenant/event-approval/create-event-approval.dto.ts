import { Field, InputType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { EventApprovalProps } from './event-approval.props';

@InputType()
export class CreateEventApprovalDto extends EventApprovalProps {
  @Field(() => String)
  @IsString()
  stepId!: Snowflake;

  @Field(() => String)
  @IsString()
  eventId!: Snowflake;
}
