import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Actor } from '../actor.entity';
import type { ActorFinanceProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorAddress } from '../actor-address/actor-address.entity';

export type ActorFinanceOptions = ActorFinanceProps &
  TenantScopedOptions & {
    payedBy?: Actor;
    address: ActorAddress;
    receipt?: FileUpload;
  };
