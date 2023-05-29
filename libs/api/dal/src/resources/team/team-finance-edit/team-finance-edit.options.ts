import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { PaymentMethod, FinanceState, PayedByType } from '@okampus/shared/enums';
import type { FileUpload } from 'graphql-upload-minimal';
import type { ActorAddress } from '../../actor/actor-address/actor-address.entity';
import type { Actor } from '../../actor/actor.entity';
import type { TeamFinance } from '../team-finance/team-finance.entity';

export type TeamFinanceEditOptions = TenantScopedOptions & {
  teamFinance: TeamFinance;
  name?: string | null;
  description?: string | null;
  amount?: number | null;
  method?: PaymentMethod | null;
  state?: FinanceState | null;
  payedByType?: PayedByType | null;
  payedAt?: Date;
  addedPayedBy?: Actor | null;
  removedPayedBy?: boolean;
  addedAddress?: ActorAddress | null;
  removedAddress?: boolean;
  addedEvent?: Event | null;
  removedEvent?: boolean;
  addedProject?: Project | null;
  removedProject?: boolean;
  addedReceipt?: FileUpload | null;
  removedReceipt?: boolean;
};
