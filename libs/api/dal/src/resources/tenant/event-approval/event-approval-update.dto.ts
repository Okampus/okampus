import { CreateEventApprovalDto } from './event-approval-create.dto';
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateEventApprovalDto extends PartialType(OmitType(CreateEventApprovalDto, ['stepId'])) {
  @Field(() => String)
  @IsString()
  id!: string;
}
