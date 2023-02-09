import type { IIndividual } from '../../actor/individual/individual.interface';
import type { ITenantEvent } from '../../content-master/event/event.interface';
import type { IFileUpload } from '../../file-upload/file-upload.interface';
import type { ITeam } from '../../org/team/team.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { IProject } from '../project/project.interface';
import type { FinanceProps } from './finance.props';

export type IFinance = ITenantScoped &
  Required<FinanceProps> & {
    team?: ITeam;
    createdBy?: IIndividual;
    linkedEvent?: ITenantEvent | null;
    linkedProject?: IProject | null;
    receipts?: IFileUpload[];
  };
