import { ScopeRole } from '@okampus/shared/enums';
import { capitalize } from '@okampus/shared/utils';
import { IsEmail, IsEnum, IsString } from 'class-validator';

// TODO: flexible (tenant-specific) TenantUserDto
export class TenantUserDto {
  @IsString()
  slug: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  primaryEmail: string;

  @IsEnum(ScopeRole)
  scopeRole: ScopeRole;

  constructor(data: { sub: string; given_name: string; family_name: string; email: string; role: string }) {
    this.slug = data.sub;
    this.firstName = data.given_name;
    this.lastName = data.family_name;
    this.primaryEmail = data.email;
    this.scopeRole = capitalize(data.role) as ScopeRole;
  }
}
