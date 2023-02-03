import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@InputType()
export class CohortProps {
  @Field(() => Int)
  @Min(1970)
  @Max(2100)
  @IsInt()
  year!: number;
}
