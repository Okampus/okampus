import { IIndividual } from '../../actor/individual/individual.interface';
import { ITenantEvent } from '../../content-master/event/event.interface';
import { IFileUpload } from '../../file-upload/file-upload.interface';
import { ITeam } from '../../org/team/team.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { IProject } from '../project/project.interface';
import { FinanceProps } from './finance.props';

export type IFinance = ITenantScoped &
  FinanceProps & {
    team?: ITeam;
    createdBy?: IIndividual;
    linkedEvent?: ITenantEvent | null;
    linkedProject?: IProject | null;
    receipts?: IFileUpload[];
  };
