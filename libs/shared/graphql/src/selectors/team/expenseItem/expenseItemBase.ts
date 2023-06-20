import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';

import { fileUploadBaseInfo } from '../../fileUpload/fileUploadBase';
import { addressBaseInfo } from '../../actor/address/addressBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const expenseItemBaseInfo = Selector('ExpenseItem')({
  ...entityBase,
  payedAt: true,
  address: addressBaseInfo,
  amount: true,
  name: true,
  category: true,
  fileUpload: fileUploadBaseInfo,
});
export type ActorFinanceBaseInfo = InputType<GraphQLTypes['ExpenseItem'], typeof expenseItemBaseInfo>;
