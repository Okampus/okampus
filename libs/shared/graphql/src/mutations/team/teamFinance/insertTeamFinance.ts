import { teamFinanceBaseInfo } from '../../../selectors/team/teamFinance/teamFinanceBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';

// @ts-expect-error - Zeus depth limit
export const insertTeamFinance = typedGql('mutation')({
  insertTeamFinanceOne: [{ object: $('insert', 'TeamFinanceInsertInput!') }, teamFinanceBaseInfo],
});
