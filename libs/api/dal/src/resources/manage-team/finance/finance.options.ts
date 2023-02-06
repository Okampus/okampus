import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { FinanceProps } from '@okampus/shared/dtos';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { Team } from '../../org/team/team.entity';
import type { Project } from '../project/project.entity';
import type { Individual } from '../../actor/individual/individual.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

export type FinanceOptions = FinanceProps &
  TenantScopedOptions & {
    team: Team;
    createdBy: Individual;
    linkedEvent?: TenantEvent | null;
    linkedProject?: Project | null;
    receipts?: FileUpload[];
  };
