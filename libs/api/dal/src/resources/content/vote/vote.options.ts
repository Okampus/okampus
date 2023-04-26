import type { VoteProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Content } from '../content.entity';

export type VoteOptions = VoteProps &
  TenantScopedOptions & {
    lastActiveDate?: Date | null;
    content?: Content | null;
  };
