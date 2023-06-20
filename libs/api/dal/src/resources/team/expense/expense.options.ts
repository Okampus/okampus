import type { User } from '../../individual/user/user.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { ExpenseProps } from '@okampus/shared/dtos';

export type ExpenseOptions = ExpenseProps &
  TenantScopedOptions & {
    formSubmission: FormSubmission;
    joiner: User;
    team: Team;
    askedRole: Role;
  };
