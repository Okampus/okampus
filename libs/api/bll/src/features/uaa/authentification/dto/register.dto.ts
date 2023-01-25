import { Field, InputType } from '@nestjs/graphql';
import { RoleType, ScopeRole } from '@okampus/shared/enums';
import { colorStringTransform } from '@okampus/shared/utils';
import { Transform } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsHexColor, IsOptional, IsString } from 'class-validator';

// TODO: no UserImage on create
@InputType()
export class RegisterDto {
  @Field()
  @IsString()
  slug!: string;

  @Field()
  @IsString()
  firstName!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  // TODO: add password validation so that it's not too weak
  @Field()
  @IsString()
  password!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => ScopeRole)
  @IsEnum(ScopeRole)
  scopeRole!: ScopeRole;

  @Field(() => [RoleType])
  @IsOptional()
  @IsArray()
  @IsEnum(RoleType, { each: true })
  roles?: RoleType[];

  @Field()
  @IsOptional()
  @IsString()
  status?: string;

  @Field()
  @IsOptional()
  @IsString()
  avatar?: string;

  @Field()
  @IsOptional()
  @IsString()
  banner?: string;

  @Field()
  @IsOptional()
  @IsHexColor()
  @Transform(colorStringTransform)
  color?: string;

  @Field()
  @IsOptional()
  @IsString()
  signature?: string;
}
