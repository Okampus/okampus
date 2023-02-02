import { JoinKind, JoinState } from '@okampus/shared/enums';
import { IIndividual } from '../actor/individual/individual.interface';
import { IUser } from '../actor/user/user.interface';
import { ITenantScoped } from '../tenant-scoped.interface';
import { IFormSubmission } from '../ugc/form-submission/form-submission.interface';
import { JoinProps } from './join.props';

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
