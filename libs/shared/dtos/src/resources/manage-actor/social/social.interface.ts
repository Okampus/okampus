import { IActor } from '../../actor/actor.interface';
import { ITenantScopedEntity } from '../../tenant-scoped.interface';
import { SocialProps } from './social.props';

export type ISocial = ITenantScopedEntity &
  SocialProps & {
    actor?: IActor;
  };
