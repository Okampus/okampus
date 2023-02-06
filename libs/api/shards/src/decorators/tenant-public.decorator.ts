import { IS_TENANT_PUBLIC } from '../consts/identifiers';
import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

export const TenantPublic = (): CustomDecorator => SetMetadata(IS_TENANT_PUBLIC, true);
