import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { MyEfreiDto } from './myefrei.dto';
import { RegisterDto } from './register.dto';

export class PreRegisterSsoDto extends IntersectionType(
  MyEfreiDto,
  PickType(RegisterDto, ['tenantId', 'avatar', 'banner', 'color', 'signature', 'schoolRole', 'roles', 'shortDescription']),
) {}
