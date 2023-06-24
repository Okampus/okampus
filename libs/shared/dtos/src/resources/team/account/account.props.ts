import { Field, Float, InputType } from '@nestjs/graphql';
import { AccountType } from '@okampus/shared/enums';
import { IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class AccountProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => AccountType)
  @IsEnum(AccountType)
  type!: AccountType;

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  balance!: number;
}
