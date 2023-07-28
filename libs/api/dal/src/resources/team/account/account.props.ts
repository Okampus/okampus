import { Field, InputType } from '@nestjs/graphql';
import { AccountType } from '@okampus/shared/enums';
import { IsEnum, IsString, Length } from 'class-validator';

@InputType()
export class AccountProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => AccountType)
  @IsEnum(AccountType)
  type!: AccountType;
}
