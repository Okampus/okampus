import { $ } from '../../../zeus';
import { id } from '../../id';
import { teamFinanceBaseInfo } from '../../../selectors/team/teamFinance/teamFinanceBase';
import { typedGql } from '../../../zeus/typedDocumentNode';

import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const updateTeamFinanceMutation = typedGql('mutation')({
  updateTeamFinanceByPk: [
    { pkColumns: { id }, _set: $('update', 'TeamFinanceSetInput!') as ValueTypes['TeamFinanceSetInput'] },
    teamFinanceBaseInfo,
  ],
});
