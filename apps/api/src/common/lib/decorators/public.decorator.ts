import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@lib/constants';

export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
