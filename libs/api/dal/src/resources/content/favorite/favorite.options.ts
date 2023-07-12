import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Content } from '../content.entity';
import type { FavoriteProps } from '@okampus/shared/dtos';

export type FavoriteOptions = FavoriteProps &
  TenantScopedOptions & {
    lastActiveDate?: Date | null;
    content?: Content | null;
  };
