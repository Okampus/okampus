import type { Location } from '../location/location.entity';
import type { LegalUnit } from './legal-unit.entity';
import type { Either } from '@okampus/shared/types';
import type { ActorOptions } from '../actor.options';
import type { LegalUnitProps } from './legal-unit.props';
import type { Actor } from '../actor.entity';

export type LegalUnitOptions = LegalUnitProps &
  Either<Omit<ActorOptions, 'user' | 'team'>, { actor: Actor }> & {
    headquartersLocation?: Location | null;
    parent?: LegalUnit | null;
    children?: LegalUnit[];
  };
