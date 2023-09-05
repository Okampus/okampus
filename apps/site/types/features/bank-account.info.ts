import type { BankInfoMinimalInfo } from './bank-info.info';
import type { TeamMinimalInfo } from './team.info';

export type BankAccountMinimalInfo = {
  id: string;
  name: string | null;
  team: TeamMinimalInfo;
  type: string;
  transactionsAggregate: { aggregate?: { sum?: { amount?: number | null } | null } | null };
};

export type BankAccountDetailsInfo = BankAccountMinimalInfo & {
  childrenAccounts: BankAccountMinimalInfo[];
  parent: BankAccountMinimalInfo | null;
  bankInfo: BankInfoMinimalInfo | null;
};
