import type { Location } from '../location/location.entity';
import type { LegalUnitLocationProps } from './legal-unit-location.props';
import type { ActorOptions } from '../actor.options';
import type { LegalUnit } from '../legal-unit/legal-unit.entity';

export type LegalUnitLocationOptions = LegalUnitLocationProps &
  Omit<ActorOptions, 'individual' | 'team'> & {
    legalUnit?: LegalUnit;
    location?: Location;
  };
