import { $ } from '../../../zeus';
import { id } from '../../id';
import { financeBaseInfo } from '../../../selectors/team/finance/financeBase';
import { typedGql } from '../../../zeus/typedDocumentNode';

import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const updateFinanceMutation = typedGql('mutation')({
  updateFinanceByPk: [
    { pkColumns: { id }, _set: $('update', 'FinanceSetInput!') as ValueTypes['FinanceSetInput'] },
    financeBaseInfo,
  ],
});
