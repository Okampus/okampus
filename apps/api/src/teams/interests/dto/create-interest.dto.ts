import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { InterestState } from '../../../shared/lib/types/enums/interest-state.enum';

@InputType()
export class CreateInterestDto {
  @Field(() => InterestState)
  @IsEnum(InterestState)
  state!: InterestState;

  @Field(() => String)
  @IsString()
  message!: string;

  @Field(() => Number)
  @IsInt()
  teamId!: number;

  @Field(() => String)
  @IsString()
  userId!: string;
}
