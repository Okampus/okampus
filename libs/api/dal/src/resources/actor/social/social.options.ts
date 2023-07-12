import type { SocialProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Actor } from '../../actor/actor.entity';

export type SocialOptions = SocialProps &
  TenantScopedOptions & {
    actor: Actor;
  };
