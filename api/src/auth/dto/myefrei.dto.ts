import { IsEmail, IsEnum, IsString } from 'class-validator';
import type { MyEfreiUserinfoResponse } from '../../shared/lib/types/interfaces/myefrei-userinfo-response.interface';
import { SchoolRole } from '../../shared/modules/authorization/types/school-role.enum';

export class MyEfreiDto {
  @IsString()
  userId: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsEnum(SchoolRole)
  schoolRole: SchoolRole;

  constructor(data: MyEfreiUserinfoResponse) {
    this.userId = data.sub;
    this.firstname = data.given_name!;
    this.lastname = data.family_name!;
    this.email = data.email!;
    this.schoolRole = data.role as SchoolRole;
  }
}
