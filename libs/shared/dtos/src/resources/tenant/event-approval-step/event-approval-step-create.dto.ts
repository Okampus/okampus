import { EventApprovalStepProps } from './event-approval-step.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class CreateEventApprovalStepDto extends EventApprovalStepProps {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  validatorsIds!: string[];

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  notifieesIds!: string[];
}
