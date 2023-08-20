import type { ActorTeamIndividualInfo } from './actor.info';
import type { IndividualMinimalInfo } from './individual.info';
import type { LegalUnitMinimalInfo } from './legal-unit.info';

export type FinanceMinimalInfo = {
  id: string;
  amount: number;
  category: string;
  description: string;
  method: string;
  payedAt: string;
  payedBy: ActorTeamIndividualInfo;
  payedByType: string;
  receivedBy: ActorTeamIndividualInfo;
  createdBy?: IndividualMinimalInfo | null;
  initiatedBy?: IndividualMinimalInfo | null;
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
