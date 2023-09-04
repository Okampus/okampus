import type { TeamJoinProps } from './team-join.props';
import type { Team } from '../team.entity';
import type { FormSubmission } from '../../form/form-submission/form-submission.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { TeamRole } from '../team-role/team-role.entity';
import type { Pole } from '../pole/pole.entity';
import type { User } from '../../user/user.entity';
import type { ApprovalState } from '@okampus/shared/enums';

export type TeamJoinOptions = TeamJoinProps &
  TenantScopedOptions & {
    state: ApprovalState;
    processedAt?: Date | null;
    formSubmission?: FormSubmission | null;
    joinedBy: User;
    processedBy?: User | null;
    team: Team;
    askedRole: TeamRole;
    receivedRole?: TeamRole | null;
    receivedPole?: Pole | null;
  };
