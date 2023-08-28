import type { ActorTeamUserInfo } from './actor.info';
import type { UserMinimalInfo } from './user.info';
import type { LegalUnitMinimalInfo } from './legal-unit.info';

export type FinanceMinimalInfo = {
  id: string;
  amount: number;
  category: string;
  description: string;
  method: string;
  payedAt: string;
  payedBy: ActorTeamUserInfo;
  payedByType: string;
  receivedBy: ActorTeamUserInfo;
  createdBy?: UserMinimalInfo | null;
  initiatedBy?: UserMinimalInfo | null;
  project?: { id: string; name: string } | null;
  event?: { id: string; name: string } | null;
  legalUnit?: LegalUnitMinimalInfo | null;
  financeAttachments: {
    attachment: {
      id: string;
      type: string;
      size: number;
      name: string;
      url: string;
    };
  }[];
};
