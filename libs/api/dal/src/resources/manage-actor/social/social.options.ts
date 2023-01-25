import { SocialProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Actor } from '../../actor/actor.entity';

export type SocialOptions = SocialProps &
  TenantScopedOptions & {
    actor: Actor;
  };
