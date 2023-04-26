import { projectBaseInfo } from './projectBase';
import { Selector } from '../../zeus';
import { teamFinanceBaseInfo } from '../team/teamFinance/teamFinanceBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const projectWithFinanceInfo = Selector('Project')({
  ...projectBaseInfo,
  expectedBudget: true,
  actualBudget: true,
  teamFinances: [{}, teamFinanceBaseInfo],
});
export type ProjectWithFinanceInfo = InputType<GraphQLTypes['Project'], typeof projectWithFinanceInfo>;