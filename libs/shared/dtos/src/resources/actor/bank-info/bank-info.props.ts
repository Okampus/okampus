import { Field, InputType } from '@nestjs/graphql';
import { Countries } from '@okampus/shared/consts';
import { Length, IsString, IsEnum } from 'class-validator';

@InputType()
export class BankInfoProps {
  @Field(() => String, { nullable: true })
  @Length(3, 150)
  @IsString()
  holderName?: string;

  @Field(() => String)
  @IsEnum(Countries)
  @IsString()
  country!: string;

  @Field(() => String)
  @IsString()
  countryCode!: string;

  @Field(() => String)
  @IsString()
  bankCode!: string;

  @Field(() => String)
  @IsString()
  agencyCode!: string;

  @Field(() => String)
  @IsString()
  accountCode!: string;

  @Field(() => String)
  @IsString()
  checksum!: string;
}
