import { IS_PUBLIC } from '../consts/identifiers';
import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC, true);
