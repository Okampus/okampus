import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { locationBaseInfo } from '../location/locationBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const legalUnitLocationMinimalInfo = Selector('LegalUnitLocation')({
  ...entityBase,
  type: true,
  location: locationBaseInfo,
});
export type LegalUnitLocationMinimalInfo = InputType<
  GraphQLTypes['LegalUnitLocation'],
  typeof legalUnitLocationMinimalInfo
>;
