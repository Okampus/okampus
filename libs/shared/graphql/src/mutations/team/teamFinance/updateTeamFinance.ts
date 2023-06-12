import { $ } from '../../../zeus';
import { id } from '../../id';
import { teamFinanceBaseInfo } from '../../../selectors/team/teamFinance/teamFinanceBase';
import { typedGql } from '../../../zeus/typedDocumentNode';

import type { ValueTypes } from '../../../zeus';

export const updateTeamFinanceMutation = typedGql('mutation')({
  updateTeamFinanceByPk: [
    { pkColumns: { id }, _set: $('update', 'TeamFinanceSetInput!') as ValueTypes['TeamFinanceSetInput'] },
    teamFinanceBaseInfo,
  ],
});
