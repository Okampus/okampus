import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class UgcProps {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @Field(() => String)
  @Length(1, 20_000)
  @IsString()
  text!: string;
}
