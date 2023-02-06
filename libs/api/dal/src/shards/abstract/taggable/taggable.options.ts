import type { Tag } from '../../../resources/label/tag/tag.entity';
import type { TenantScopedOptions } from '../tenant-scoped/tenant-scoped.options';

export type TaggableOptions = TenantScopedOptions & {
  tags?: Tag[];
};
