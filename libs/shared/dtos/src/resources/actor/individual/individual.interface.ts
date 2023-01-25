import { IndividualKind } from '@okampus/shared/enums';
import { ITenantScopedEntity } from '../../tenant-scoped.interface';
import { IActor } from '../actor.interface';

export type IIndividual = ITenantScopedEntity & {
  actor?: IActor;
  individualKind: IndividualKind;
};
