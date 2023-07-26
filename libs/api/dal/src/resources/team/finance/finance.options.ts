import type { Expense } from '../expense/expense.entity';
import type { Team } from '../team.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { FinanceProps } from './finance.props';
import type { Actor } from '../../actor/actor.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Account } from '../account/account.entity';
import type { Individual } from '../../individual/individual.entity';

export type FinanceOptions = FinanceProps &
  TenantScopedOptions & {
    team: Team;
    account: Account;
    payedBy: Actor;
    initiatedBy?: Individual | null;
    receivedBy: Actor;
    event?: Event | null;
    location?: Location | null;
    expense?: Expense | null;
    project?: Project | null;
    attachments?: FileUpload[];
  };
