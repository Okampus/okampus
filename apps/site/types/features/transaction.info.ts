import type { ActorTeamUserInfo } from './actor.info';
import type { UserMinimalInfo } from './user.info';
import type { LegalUnitMinimalInfo } from './legal-unit.info';

export type TransactionMinimalInfo = {
  id: string;
  amount: number;
  type: string;
  description: string;
  method: string;
  payedAt: string;
  payedBy: ActorTeamUserInfo;
  processedByType: string;
  receivedBy: ActorTeamUserInfo;
  createdBy?: UserMinimalInfo | null;
  processedBy?: UserMinimalInfo | null;
  project?: { id: string; name: string } | null;
  event?: { id: string; name: string } | null;
  legalUnit?: LegalUnitMinimalInfo | null;
  transactionAttachments: {
    attachment: {
      id: string;
      type: string;
      size: number;
      name: string;
      url: string;
    };
  }[];
};
