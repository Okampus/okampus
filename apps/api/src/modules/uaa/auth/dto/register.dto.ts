import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsHexColor,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '@common/modules/authorization/types/role.enum';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';
import { colorStringTransform } from '@lib/utils/color-string-transform';

// TODO: no UserImage on create
@InputType()
export class RegisterDto {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  // TODO: add password validation so that it's not too weak
  @Field()
  @IsString()
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field()
  @IsEnum(ScopeRole)
  scopeRole: ScopeRole;

  @Field(() => [Role])
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];

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
