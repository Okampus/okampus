import type { Expense } from '../expense/expense.entity';
import type { Team } from '../team.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { FinanceProps } from '@okampus/shared/dtos';
import type { Address } from '../../actor/address/address.entity';
import type { Actor } from '../../actor/actor.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

export type FinanceOptions = FinanceProps &
  TenantScopedOptions & {
    team: Team;
    address?: Address | null;
    payedBy?: Actor | null;
    event?: Event | null;
    expense?: Expense | null;
    project?: Project | null;
    attachments?: FileUpload[];
  };
