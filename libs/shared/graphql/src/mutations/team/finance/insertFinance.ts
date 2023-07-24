import { financeBaseInfo } from '../../../selectors/team/finance/financeBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertFinanceMutation = typedGql('mutation')({
  insertFinanceOne: [
    { object: $('object', 'FinanceInsertInput!') as ValueTypes['FinanceInsertInput'] },
    financeBaseInfo,
  ],
});
