import type { IndividualKind } from '@okampus/shared/enums';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { IActor } from '../actor.interface';

export type IIndividual = ITenantScoped & {
  individualKind: IndividualKind;
  actor?: IActor;
};
