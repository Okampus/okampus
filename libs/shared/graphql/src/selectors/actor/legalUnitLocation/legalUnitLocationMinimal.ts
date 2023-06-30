import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { locationBaseInfo } from '../location/locationBase';
import { legalUnitMinimalInfo } from '../legalUnit/legalUnitMinimal';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const legalUnitLocationMinimalInfo = Selector('LegalUnitLocation')({
  ...entityBase,
  locationType: true,
  legalName: true,
  actor: { website: true, name: true },
  legalUnit: legalUnitMinimalInfo,
  location: locationBaseInfo,
});
export type LegalUnitLocationMinimalInfo = InputType<
  GraphQLTypes['LegalUnitLocation'],
  typeof legalUnitLocationMinimalInfo
>;
