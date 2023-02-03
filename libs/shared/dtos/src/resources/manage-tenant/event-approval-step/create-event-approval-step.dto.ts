import { Field, InputType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsArray, IsString } from 'class-validator';
import { EventApprovalStepProps } from './event-approval-step.props';

@InputType()
export class CreateEventApprovalStepDto extends EventApprovalStepProps {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  validatorsIds!: Snowflake[];

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  notifieesIds!: Snowflake[];
}
