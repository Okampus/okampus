import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { teamMinimalInfo } from '../teamMinimal';
import { bankInfoBase } from '../../actor/bankInfo/bankInfoBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const accountAllocateBaseInfo = Selector('AccountAllocate')({
  ...entityBase,
  account: {
    ...entityBase,
    balance: true,
    bankInfo: bankInfoBase,
    name: true,
    type: true,
    team: teamMinimalInfo,
  },
  balance: true,
  team: teamMinimalInfo,
});
export type AccountAllocateBaseInfo = InputType<GraphQLTypes['AccountAllocate'], typeof accountAllocateBaseInfo>;
