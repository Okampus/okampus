import { projectBaseInfo } from './projectBase';
import { entityBase } from '../entityBase';
import { Selector } from '../../zeus';
import { financeBaseInfo } from '../team/finance/financeBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const projectManageInfo = Selector('Project')({
  ...projectBaseInfo,
  budget: true,
  finances: [{}, financeBaseInfo],
  events: [{}, { ...entityBase, budget: true, financesAggregate: [{}, { aggregate: { sum: { amount: true } } }] }],
});
export type ProjectManageInfo = InputType<GraphQLTypes['Project'], typeof projectManageInfo>;
