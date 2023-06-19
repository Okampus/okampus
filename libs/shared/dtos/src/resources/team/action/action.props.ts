import { Field, InputType, Int } from '@nestjs/graphql';
import { ApprovalState } from '@okampus/shared/enums';
import { IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class ActionProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 20_000)
  @IsString()
  description?: string | null = null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  points?: number | null = null;

  @Field(() => ApprovalState, { nullable: true })
  @IsEnum(ApprovalState)
  state?: ApprovalState = ApprovalState.Pending;
}
