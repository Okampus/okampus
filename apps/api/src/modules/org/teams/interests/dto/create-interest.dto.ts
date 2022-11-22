import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { InterestState } from '@meta/shared/lib/types/enums/interest-state.enum';

@InputType()
export class CreateInterestDto {
  @Field(() => InterestState)
  @IsEnum(InterestState)
  state!: InterestState;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  message: string | null = null;

  @Field(() => Number)
  @IsInt()
  teamId!: number;

  @Field(() => String)
  @IsString()
  userId!: string;
}
