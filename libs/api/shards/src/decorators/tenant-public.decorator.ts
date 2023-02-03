import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { IS_TENANT_PUBLIC } from '../consts/identifiers';

export const TenantPublic = (): CustomDecorator => SetMetadata(IS_TENANT_PUBLIC, true);
