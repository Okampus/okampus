import type { Team } from '../team/team.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { FormProps } from '@okampus/shared/dtos';

export type FormOptions = FormProps &
  TenantScopedOptions & {
    team?: Team | null;
  };
