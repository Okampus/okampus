import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Content } from '../content.entity';

export type FavoriteOptions = TenantScopedOptions & {
  content?: Content | null;
};
