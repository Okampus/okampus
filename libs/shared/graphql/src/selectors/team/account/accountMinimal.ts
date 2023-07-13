import { teamMinimalInfo } from '../teamMinimal';
import { entityBase } from '../../entityBase';
import { Selector } from '../../../zeus';

import { bankInfoBase } from '../../actor/bankInfo/bankInfoBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const accountMinimalInfo = Selector('Account')({
  ...entityBase,
  financesAggregate: [{}, { aggregate: { sum: { amount: true } } }],
  bankInfo: bankInfoBase,
  name: true,
  team: teamMinimalInfo,
  type: true,
});
export type AccountMinimalInfo = InputType<GraphQLTypes['Account'], typeof accountMinimalInfo>;
