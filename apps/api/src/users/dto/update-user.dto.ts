import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsHexColor,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  signature: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsHexColor()
  @Transform(({ value }: { value: string }) => (value.startsWith('#') ? value.slice(1) : value))
  color: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  shortDescription: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  avatar: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  banner: string;
}
