import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Actor } from '../actor.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { LocationProps } from './location.props';
import type { Address } from '../address/address.entity';

export type LocationOptions = LocationProps &
  TenantScopedOptions & {
    actor: Actor;
    address?: Address | null;
    images?: FileUpload[];
  };
