import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const legalUnitMinimalInfo = Selector('LegalUnit')({
  ...entityBase,
  type: true,
  legalName: true,
  actor: { website: true, name: true },
});
export type LegalUnitMinimalInfo = InputType<GraphQLTypes['LegalUnit'], typeof legalUnitMinimalInfo>;
