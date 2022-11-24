import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '@common/modules/authorization/types/role.enum';
import { SchoolRole } from '@common/modules/authorization/types/school-role.enum';

export class RegisterDto {
  @IsString()
  tenantId: string;

  @IsString()
  id: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsEnum(SchoolRole)
  schoolRole: SchoolRole;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsBoolean()
  bot?: boolean;
}