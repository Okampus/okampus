import type { ActorTeamIndividualInfo } from './actor.info';
import type { IndividualMinimalInfo } from './individual.info';
import type { ProjectMinimalInfo } from './project.info';

export type FinanceMinimalInfo = {
  id: string;
  amount: number;
  category: string;
  method: string;
  payedAt: string;
  payedBy: ActorTeamIndividualInfo;
  receivedBy: ActorTeamIndividualInfo;
  createdBy?: IndividualMinimalInfo | null;
  initiatedBy?: IndividualMinimalInfo | null;
  project?: ProjectMinimalInfo | null;
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
