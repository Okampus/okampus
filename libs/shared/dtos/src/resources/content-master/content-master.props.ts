import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class ContentMasterProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 100)
  @Matches(/^[\d:a-z-]+$/)
  @IsString()
  slug?: string;

  @Field(() => String)
  @Length(1, 100)
  @IsString()
  title!: string;
}
