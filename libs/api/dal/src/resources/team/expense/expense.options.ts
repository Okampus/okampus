import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { BankInfo } from '../../actor/bank-info/bank-info.entity';
import type { User } from '../../user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Finance } from '../finance/finance.entity';
import type { ExpenseProps } from './expense.props';
import type { ExpenseItem } from '../expense-item/expense-item.entity';

export type ExpenseOptions = ExpenseProps &
  TenantScopedOptions & {
    bankInfo: BankInfo;
    processedBy: User;
    finance: Finance;
    expenseReport: FileUpload;
    expenseItems?: ExpenseItem[];
  };
