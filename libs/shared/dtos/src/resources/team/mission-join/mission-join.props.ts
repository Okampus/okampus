import { Field, InputType, Int } from '@nestjs/graphql';
import { ApprovalState } from '@okampus/shared/enums';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class MissionJoinProps {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  points?: number | null = null;

  @Field(() => ApprovalState, { nullable: true })
  @IsEnum(ApprovalState)
  state?: ApprovalState = ApprovalState.Pending;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean | null = null;
}
