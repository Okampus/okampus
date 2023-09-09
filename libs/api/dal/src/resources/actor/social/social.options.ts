import type { SocialProps } from './social.props';
import type { TenantScopableOptions } from '../../tenant-scoped.entity';
import type { Actor } from '../../actor/actor.entity';

export type SocialOptions = SocialProps &
  TenantScopableOptions & {
    actor: Actor;
  };
