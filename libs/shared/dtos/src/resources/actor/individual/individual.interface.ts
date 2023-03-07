import type { IndividualKind } from '@okampus/shared/enums';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { IActor } from '../actor.interface';
import type { IndividualProps } from './individual.props';

export type IIndividual = ITenantScoped &
  Required<IndividualProps> & {
    individualKind: IndividualKind;
    actor?: IActor;
  };
