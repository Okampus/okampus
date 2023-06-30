import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { bankInfoBase } from '../../actor/bankInfo/bankInfoBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const accountBaseInfo = Selector('Account')({
  ...entityBase,
  balance: true,
  bankInfo: bankInfoBase,
  name: true,
  type: true,
});
export type AccountBaseInfo = InputType<GraphQLTypes['Account'], typeof accountBaseInfo>;