import { IsEmail, IsEnum, IsString } from 'class-validator';
import type { TenantUserinfoResponse } from '../../shared/lib/types/interfaces/userinfo-response.interface';
import { SchoolRole } from '../../shared/modules/authorization/types/school-role.enum';

export class TenantDto {
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
