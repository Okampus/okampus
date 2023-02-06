import { EventApprovalStepProps } from './event-approval-step.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

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
