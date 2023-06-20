import type { ActorOptions } from '../actor/actor.options';
import type { UserOptions } from './user/user.options';
import type { Tag } from '../actor/tag/tag.entity';
import type { IndividualProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { BotOptions } from './bot/bot.options';

export type IndividualOptions = IndividualProps &
  ActorOptions &
  TenantScopedOptions & {
    tags?: Tag[];
    passwordHash?: string;
    user?: Omit<UserOptions, 'individual' | 'createdBy' | 'tenant'>;
    bot?: Omit<BotOptions, 'individual' | 'createdBy' | 'tenant'>;
  };
