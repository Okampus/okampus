import { IsEmail, IsEnum, IsString } from 'class-validator';
import type { TenantUserinfoResponse } from '@common/lib/types/interfaces/userinfo-response.interface';
import { SchoolRole } from '@common/modules/authorization/types/school-role.enum';

// TODO: flexible (tenant-specific) TenantUserDto
export class TenantUserDto {
  @IsString()
  id: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsEnum(SchoolRole)
  schoolRole: SchoolRole;

  constructor(data: TenantUserinfoResponse) {
    this.id = data.sub;
    this.firstname = data.given_name!;
    this.lastname = data.family_name!;
    this.email = data.email!;
    this.schoolRole = data.role as SchoolRole;
  }
}
