import { IndividualKind } from '@okampus/shared/enums';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { IActor } from '../actor.interface';

export type IIndividual = ITenantScoped & {
  individualKind: IndividualKind;
  actor?: IActor;
};
