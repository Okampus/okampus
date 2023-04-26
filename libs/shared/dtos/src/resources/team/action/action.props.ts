import { Field, InputType, Int } from '@nestjs/graphql';
import { ApprovalState } from '@okampus/shared/enums';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

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

  @Field(() => ApprovalState)
  @IsEnum(ApprovalState)
  state!: ApprovalState;

  @Field(() => Int)
  @IsInt()
  score!: number;
}
