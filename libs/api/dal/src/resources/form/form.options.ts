import type { Team } from '../team/team.entity';
import type { TenantScopedOptions } from '../tenant-scoped.entity';
import type { FormProps } from './form.props';

export type FormOptions = FormProps &
  TenantScopedOptions & {
    team?: Team | null;
  };
