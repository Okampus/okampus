import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { FinanceProps } from '@okampus/shared/dtos';
import { TenantEvent } from '../../content-master/event/event.entity';
import { Team } from '../../org/team/team.entity';
import { Project } from '../project/project.entity';
import { Individual } from '../../actor/individual/individual.entity';
import { FileUpload } from '../../file-upload/file-upload.entity';

export type FinanceOptions = FinanceProps &
  TenantScopedOptions & {
    team: Team;
    createdBy: Individual;
    linkedEvent?: TenantEvent | null;
    linkedProject?: Project | null;
    receipts?: FileUpload[];
  };
