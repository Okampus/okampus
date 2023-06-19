import type { ApprovalState } from '@okampus/shared/enums';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { TeamJoinProps } from '@okampus/shared/dtos';
import type { Pole } from '../pole/pole.entity';
import type { Individual } from '../../individual/individual.entity';

export type TeamJoinOptions = TeamJoinProps &
  TenantScopedOptions & {
    state: ApprovalState;
    settledAt?: Date | null;
    formSubmission?: FormSubmission | null;
    joiner: UserInfo;
    settledBy?: Individual | null;
    team: Team;
    askedRole: Role;
    receivedRole?: Role | null;
    receivedPole?: Pole | null;
  };
