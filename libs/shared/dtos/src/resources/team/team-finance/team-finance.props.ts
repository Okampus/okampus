import { Field, InputType } from '@nestjs/graphql';
import { PaymentMethod, FinanceState, PayedByType } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class TeamFinanceProps {
  @Field(() => PaymentMethod)
  @IsEnum(() => PaymentMethod)
  @IsString()
  method!: PaymentMethod;

  @Field(() => PayedByType, { nullable: true })
  @IsEnum(() => PayedByType)
  @IsOptional()
  @IsString()
  payedByType?: PayedByType = PayedByType.Manual;

  @Field(() => FinanceState, { nullable: true })
  @IsEnum(() => FinanceState)
  @IsOptional()
  @IsString()
  state?: FinanceState = FinanceState.Completed;
}
