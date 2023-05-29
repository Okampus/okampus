import { teamFinanceBaseInfo } from '../../../selectors/team/teamFinance/teamFinanceBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { projectWithFinanceInfo } from '../../../selectors/project/projectWithFinance';
import { entityBase } from '../../../selectors/entityBase';
import type { ValueTypes } from '../../../zeus';

// @ts-expect-error - Zeus depth limit
export const insertTeamFinanceMutation = typedGql('mutation')({
  insertTeamFinanceOne: [
    { object: $('insert', 'TeamFinanceInsertInput!') as ValueTypes['TeamFinanceInsertInput'] },
    { ...teamFinanceBaseInfo, team: { ...entityBase, projects: [{}, projectWithFinanceInfo] } }, // TODO: replace by merge
  ],
});
