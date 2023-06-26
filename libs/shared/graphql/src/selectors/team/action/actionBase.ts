import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { individualBaseInfo } from '../../individual/individualBase';

import type { GraphQLTypes, InputType } from '../../../zeus';

export const actionBaseInfo = Selector('Action')({
  ...entityBase,
  description: true,
  points: true,
  pointsSettledBy: individualBaseInfo,
  state: true,
  name: true,
});
export type ActionBaseInfo = InputType<GraphQLTypes['Action'], typeof actionBaseInfo>;
