import type { Expense } from '../expense/expense.entity';
import type { Team } from '../team.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { TeamFinanceProps } from '@okampus/shared/dtos';
import type { ActorFinanceOptions } from '../../actor/actor-finance/actor-finance.options';

export type TeamFinanceOptions = TeamFinanceProps &
  ActorFinanceOptions &
  TenantScopedOptions & {
    team: Team;
    event?: Event | null;
    expense?: Expense | null;
    project?: Project | null;
  };
