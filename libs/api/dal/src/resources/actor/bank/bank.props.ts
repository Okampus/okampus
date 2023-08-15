import { Field, InputType } from '@nestjs/graphql';
import { Length, IsString } from 'class-validator';

@InputType()
export class BankProps {
  @Field(() => String, { nullable: true })
  @Length(3, 150)
  @IsString()
  holderName?: string;

  @Field(() => String)
  @IsString()
  bicSwift!: string;

  @Field(() => String)
  @IsString()
  iban!: string;
}
