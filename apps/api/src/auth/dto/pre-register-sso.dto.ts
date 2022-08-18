import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { TenantDto } from './tenant.dto';

export class PreRegisterSsoDto extends IntersectionType(
  TenantDto,
  PickType(RegisterDto, ['tenantId', 'avatar', 'banner', 'color', 'signature', 'schoolRole', 'roles', 'shortDescription']),
) {}
