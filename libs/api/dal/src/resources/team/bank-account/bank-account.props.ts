import { Field, InputType } from '@nestjs/graphql';
import { BankAccountType } from '@okampus/shared/enums';
import { IsEnum, IsString, Length } from 'class-validator';

@InputType()
export class BankAccountProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => BankAccountType)
  @IsEnum(BankAccountType)
  type!: BankAccountType;
}
