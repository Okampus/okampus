import { IsEmail, IsEnum, IsString } from 'class-validator';
import type { UserinfoResponse } from 'openid-client';
import { SchoolRole } from '../../shared/modules/authorization/types/school-role.enum';

export class MyEfreiDto {
  @IsString()
  userId: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsEnum(SchoolRole)
  schoolRole: SchoolRole;

  constructor(data: UserinfoResponse) {
    this.userId = data.sub;
    this.firstname = data.given_name!;
    this.lastname = data.family_name!;
    this.fullname = data.name!;
    this.email = data.email!;
    this.schoolRole = data.role as SchoolRole;
  }
}
