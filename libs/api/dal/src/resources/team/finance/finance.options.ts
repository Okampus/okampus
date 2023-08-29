import type { Expense } from '../expense/expense.entity';
import type { Team } from '../team.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { FinanceProps } from './finance.props';
import type { Actor } from '../../actor/actor.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { BankAccount } from '../bank-account/bank-account.entity';
import type { User } from '../../user/user.entity';

export type FinanceOptions = FinanceProps &
  TenantScopedOptions & {
    team: Team;
    bankAccount: BankAccount;
    payedBy: Actor;
    initiatedBy?: User | null;
    receivedBy: Actor;
    event?: Event | null;
    location?: Location | null;
    expense?: Expense | null;
    project?: Project | null;
    attachments?: FileUpload[];
  };
