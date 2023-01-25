import { Field, InputType } from '@nestjs/graphql';
import { UUID } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { EventApprovalProps } from './event-approval.props';

@InputType()
export class CreateEventApprovalDto extends EventApprovalProps {
  @Field(() => String)
  @IsString()
  stepId!: UUID;

  @Field(() => String)
  @IsString()
  eventId!: UUID;
}
