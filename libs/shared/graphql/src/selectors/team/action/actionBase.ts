import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { individualBaseInfo } from '../../individual/individualBase';

import type { GraphQLTypes, InputType } from '../../../zeus';

export const actionBaseInfo = Selector('Action')({
  ...entityBase,
  description: true,
  score: true,
  state: true,
  name: true,
  individualByValidatedById: individualBaseInfo,
});
export type ActionBaseInfo = InputType<GraphQLTypes['Action'], typeof actionBaseInfo>;
