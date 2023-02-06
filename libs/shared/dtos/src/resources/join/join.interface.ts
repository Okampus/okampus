import type { JoinKind, JoinState } from '@okampus/shared/enums';
import type { IIndividual } from '../actor/individual/individual.interface';
import type { IUser } from '../actor/user/user.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { IFormSubmission } from '../ugc/form-submission/form-submission.interface';
import type { JoinProps } from './join.props';

export type IJoin = ITenantScoped &
  JoinProps & {
    joinKind: JoinKind;
    issuer?: IIndividual | null;
    joiner?: IUser;
    validatedBy?: IIndividual | null;
    validatedAt: Date | null;
    validationMessage: string | null;
    formSubmission?: IFormSubmission | null;
    state: JoinState;
  };
