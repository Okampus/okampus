import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Bank } from '../../actor/bank/bank.entity';
import type { User } from '../../user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Finance } from '../finance/finance.entity';
import type { ExpenseProps } from './expense.props';
import type { ExpenseItem } from '../expense-item/expense-item.entity';

export type ExpenseOptions = ExpenseProps &
  TenantScopedOptions & {
    bank: Bank;
    processedBy: User;
    finance: Finance;
    expenseReport: FileUpload;
    expenseItems?: ExpenseItem[];
  };
