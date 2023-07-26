import type { VoteProps } from './vote.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Content } from '../content.entity';

export type VoteOptions = VoteProps &
  TenantScopedOptions & {
    lastActiveDate?: Date | null;
    content?: Content | null;
  };
