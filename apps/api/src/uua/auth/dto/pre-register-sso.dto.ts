import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { TenantUserDto } from './tenant-user.dto';

export class PreRegisterSsoDto extends IntersectionType(
  TenantUserDto,
  PickType(RegisterDto, ['tenantId', 'avatar', 'banner', 'color', 'signature', 'schoolRole', 'roles', 'shortDescription']),
) {}
