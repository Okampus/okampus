import type { ActorOptions } from '../actor/actor.options';
import type { UserInfoOptions } from './user-info/user-info.options';
import type { Tag } from '../actor/tag/tag.entity';
import type { IndividualProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { BotInfoOptions } from './bot-info/bot-info.options';

export type IndividualOptions = IndividualProps &
  ActorOptions &
  TenantScopedOptions & {
    tags?: Tag[];
    passwordHash?: string;
    userInfo?: Omit<UserInfoOptions, 'individual' | 'createdBy' | 'tenant'>;
    botInfo?: Omit<BotInfoOptions, 'individual' | 'createdBy' | 'tenant'>;
  };
