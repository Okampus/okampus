import { $ } from '../../../zeus';
import { teamFinanceBaseInfo } from '../../../selectors/team/teamFinance/teamFinanceBase';
import { typedGql } from '../../../zeus/typedDocumentNode';

import type { ValueTypes } from '../../../zeus';

export const updateTeamFinanceMutation = typedGql('mutation')({
  updateTeamFinanceByPk: [
    {
      pkColumns: { id: $('id', 'bigint!') },
      _set: $('update', 'TeamFinanceSetInput!') as ValueTypes['TeamFinanceSetInput'],
    },
    teamFinanceBaseInfo,
  ],
});
