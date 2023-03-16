import { JoinProps } from './join.props';
import { FormSubmissionProps } from '../ugc/form-submission/form-submission.props';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateJoinDto extends IntersectionType(JoinProps, FormSubmissionProps) {
  @Field(() => String, { nullable: true })
  @IsString() // TODO: create custom validator for UUID
  @IsOptional()
  joinerId?: Snowflake;

  @Field(() => String)
  @IsString() // TODO: create custom validator for UUID
  linkedFormEditId!: Snowflake;
}
