import type { TenantScopableOptions } from '../..';
import type { BankAccount } from '../../team/bank-account/bank-account.entity';
import type { Expense } from '../../team/expense/expense.entity';
import type { Project } from '../../team/project/project.entity';
import type { Actor } from '../actor.entity';
import type { TransactionProps } from './transaction.props';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { User } from '../../user/user.entity';
import type { Event } from '../../event/event.entity';

export type TransactionOptions = TransactionProps &
  TenantScopableOptions & {
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
