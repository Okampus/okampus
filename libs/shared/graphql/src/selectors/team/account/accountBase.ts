import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';

import { accountAllocateBaseInfo } from '../accountAllocate/accountAllocateBase';
import { bankInfoBase } from '../../actor/bankInfo/bankInfoBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const accountBaseInfo = Selector('Account')({
  ...entityBase,
  accountAllocates: [{}, accountAllocateBaseInfo],
  bankInfo: bankInfoBase,
  balance: true,
  name: true,
  type: true,
});
export type AccountBaseInfo = InputType<GraphQLTypes['Account'], typeof accountBaseInfo>;
