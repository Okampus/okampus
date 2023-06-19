import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';

import { fileUploadBaseInfo } from '../../fileUpload/fileUploadBase';
import { actorAddressBaseInfo } from '../../actor/actorAddress/actorAddressBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const expenseItemBaseInfo = Selector('ExpenseItem')({
  ...entityBase,
  payedAt: true,
  address: actorAddressBaseInfo,
  amount: true,
  name: true,
  category: true,
  fileUpload: fileUploadBaseInfo,
});
export type ActorFinanceBaseInfo = InputType<GraphQLTypes['ExpenseItem'], typeof expenseItemBaseInfo>;
