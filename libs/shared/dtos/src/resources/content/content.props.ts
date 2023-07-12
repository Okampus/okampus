import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsBoolean, Length, IsString } from 'class-validator';

@InputType()
export class ContentProps {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @Field(() => String)
  @Length(1, 20_000)
  @IsString()
  text!: string;
}
