import type { Location } from '../../location/location.entity';
import type { LegalUnit } from './legal-unit.entity';
import type { LegalUnitProps } from './legal-unit.props';
import type { ActorProps } from '../actor.props';
import type { BaseOptions } from '../../base.options';

export type LegalUnitOptions = LegalUnitProps &
  ActorProps &
  BaseOptions & {
    headquartersLocation?: Location | null;
    parent?: LegalUnit | null;
    children?: LegalUnit[];
  };
