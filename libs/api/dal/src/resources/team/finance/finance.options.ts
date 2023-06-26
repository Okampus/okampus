import type { Expense } from '../expense/expense.entity';
import type { Team } from '../team.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { FinanceProps } from '@okampus/shared/dtos';
import type { Actor } from '../../actor/actor.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

export type FinanceOptions = FinanceProps &
  TenantScopedOptions & {
    team: Team;
    payedBy?: Actor | null;
    receivedBy: Actor;
    event?: Event | null;
    expense?: Expense | null;
    project?: Project | null;
    attachments?: FileUpload[];
  };
