import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { legalUnitLocationMinimalInfo } from '../legalUnitLocation/legalUnitLocationMinimal';

import type { GraphQLTypes, InputType } from '../../../zeus';

export const bankInfoBase = Selector('BankInfo')({
  ...entityBase,
  bank: legalUnitLocationMinimalInfo,
  accountCode: true,
});
export type BankInfoBaseInfo = InputType<GraphQLTypes['BankInfo'], typeof bankInfoBase>;
