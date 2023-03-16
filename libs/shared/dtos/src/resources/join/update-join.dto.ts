import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApprovalState } from '@okampus/shared/enums';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateJoinDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  settledMessage?: Snowflake;

  @Field(() => ApprovalState, { nullable: true })
  @IsEnum(ApprovalState)
  @IsOptional()
  state?: ApprovalState;
}
