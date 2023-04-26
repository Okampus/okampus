import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@InputType()
export class VoteProps {
  @Field(() => Int)
  @Min(-1)
  @Max(1)
  @IsInt()
  value!: number;
}
