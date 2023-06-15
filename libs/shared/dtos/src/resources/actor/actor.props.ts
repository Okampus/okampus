import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class ActorProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 100)
  @Matches(/^[\d:a-z-]+$/)
  @IsString()
  slug?: string;

  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  primaryEmail?: string | null;
}
