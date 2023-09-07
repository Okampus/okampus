import type { TenantScopedOptions } from '../tenant-scoped.entity';
import type { Actor } from '../actor/actor.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { LocationProps } from './location.props';
import type { Address } from '../actor/address/address.entity';

export type LocationOptions = LocationProps &
  TenantScopedOptions & {
    actor: Actor;
    address?: Address | null;
    images?: FileUpload[];
  };
