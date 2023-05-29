import { EventApprovalProps } from './event-approval.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateEventApprovalDto extends EventApprovalProps {
  @Field(() => String)
  @IsString()
  stepId!: string;

  @Field(() => String)
  @IsString()
  eventId!: string;
}
