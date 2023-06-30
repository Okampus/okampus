import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class GrantProps {
  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  askedAmount!: number;

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  receivedAmount!: number;
}
