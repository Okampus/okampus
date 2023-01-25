import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { UUID } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { CreateEventApprovalDto } from './create-event-approval.dto';

@InputType()
export class UpdateEventApprovalDto extends PartialType(OmitType(CreateEventApprovalDto, ['stepId'])) {
  @Field(() => String)
  @IsString()
  id!: UUID;
}
