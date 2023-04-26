import { Selector } from '../../../zeus';
import { actorFinanceBaseInfo } from '../../actor/actorFinance/actorFinanceBase';
import { projectBaseInfo } from '../../project/projectBase';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamFinanceBaseInfo = Selector('TeamFinance')({
  ...entityBase,
  actorFinance: actorFinanceBaseInfo,
  project: projectBaseInfo,
  method: true,
});
export type TeamFinanceBaseInfo = InputType<GraphQLTypes['TeamFinance'], typeof teamFinanceBaseInfo>;
