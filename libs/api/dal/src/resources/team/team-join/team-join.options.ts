import type { ApprovalState } from '@okampus/shared/enums';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { TeamJoinProps } from '@okampus/shared/dtos';

export type TeamJoinOptions = TeamJoinProps &
  TenantScopedOptions & {
    state: ApprovalState;
    formSubmission?: FormSubmission | null;
    joiner: UserInfo;
    team: Team;
    askedRole: Role;
  };
