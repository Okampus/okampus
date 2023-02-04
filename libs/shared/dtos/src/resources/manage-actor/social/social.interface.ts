import type { IActor } from '../../actor/actor.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { SocialProps } from './social.props';

export type ISocial = ITenantScoped &
  SocialProps & {
    actor?: IActor;
  };
