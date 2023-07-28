import type { SocialProps } from './social.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Actor } from '../../actor/actor.entity';

export type SocialOptions = SocialProps &
  TenantScopedOptions & {
    actor: Actor;
  };
