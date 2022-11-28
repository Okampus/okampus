import { IsEmail, IsEnum, IsString } from 'class-validator';
import capitalize from 'lodash.capitalize';
import type { TenantUserinfoResponse } from '@common/lib/types/interfaces/userinfo-response.interface';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';

// TODO: flexible (tenant-specific) TenantUserDto
export class TenantUserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsEnum(ScopeRole)
  scopeRole: ScopeRole;

  constructor(data: TenantUserinfoResponse) {
    this.id = data.sub;
    this.name = data.given_name!;
    this.lastName = data.family_name!;
    this.email = data.email!;
    this.scopeRole = capitalize(data.role) as ScopeRole;
  }
}
