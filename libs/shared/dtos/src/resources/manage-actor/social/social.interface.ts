import { IActor } from '../../actor/actor.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { SocialProps } from './social.props';

export type ISocial = ITenantScoped &
  SocialProps & {
    actor?: IActor;
  };
