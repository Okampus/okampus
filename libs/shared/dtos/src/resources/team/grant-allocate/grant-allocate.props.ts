import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class GrantAllocateProps {
  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amountAsked!: number;

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amountGiven!: number;
}
