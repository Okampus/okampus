import type { BankMinimalInfo } from './bank.info';
import type { TeamMinimalInfo } from './team.info';

export type AccountMinimalInfo = {
  id: string;
  name: string;
  team: TeamMinimalInfo;
  type: string;
  financesAggregate: { aggregate?: { sum?: { amount?: number | null } | null } | null };
};

export type AccountDetailsInfo = AccountMinimalInfo & {
  children: AccountMinimalInfo[];
  parent?: AccountMinimalInfo | null;
  bank?: BankMinimalInfo | null;
};
