import type { ActorProps } from '../actor.props';
import type { BaseOptions } from '../../base.options';
import type { Location } from '../../location/location.entity';
import type { LegalUnitLocationProps } from './legal-unit-location.props';
import type { LegalUnit } from '../legal-unit/legal-unit.entity';

export type LegalUnitLocationOptions = LegalUnitLocationProps &
  ActorProps &
  BaseOptions & {
    legalUnit?: LegalUnit;
    location?: Location;
  };
