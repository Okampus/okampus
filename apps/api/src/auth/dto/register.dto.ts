import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import type { Role } from '../../shared/modules/authorization/types/role.enum';
import { SchoolRole } from '../../shared/modules/authorization/types/school-role.enum';

export class RegisterDto {
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
  @IsEnum({ each: true })
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
}
