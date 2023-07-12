import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class ThreadProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @Length(1, 100)
  @Matches(/^[\d:a-z-]+$/)
  @IsOptional()
  @IsString()
  slug?: string;
}
