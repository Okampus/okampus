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
  @Field()
  @IsOptional()
  @IsEmail()
  email: string;

  @Field()
  @IsOptional()
  @IsString()
  signature: string;

  @Field()
  @IsOptional()
  @IsHexColor()
  @Transform(({ value }: { value: string }) => (value.startsWith('#') ? value.slice(1) : value))
  color: string;

  @Field()
  @IsOptional()
  @IsString()
  shortDescription: string;

  @Field()
  @IsOptional()
  @IsString()
  avatar: string;

  @Field()
  @IsOptional()
  @IsString()
  banner: string;
}
