import { CreateEventApprovalStepDto } from './event-approval-step-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateEventApprovalStepDto extends PartialType(CreateEventApprovalStepDto) {
  @Field(() => String)
  @IsString()
  id!: string;
}
