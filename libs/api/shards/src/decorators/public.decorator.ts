import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC } from '../consts/identifiers';

export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC, true);
