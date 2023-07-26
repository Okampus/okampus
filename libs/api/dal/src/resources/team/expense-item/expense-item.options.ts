import type { Expense } from '../expense/expense.entity';
import type { LegalUnit } from '../../actor/legal-unit/legal-unit.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { ExpenseItemProps } from './expense-item.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type ExpenseItemOptions = ExpenseItemProps &
  TenantScopedOptions & {
    company?: LegalUnit | null;
    expense?: Expense | null;
    attachments?: FileUpload[];
  };
