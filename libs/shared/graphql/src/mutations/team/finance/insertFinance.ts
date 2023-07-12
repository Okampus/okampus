import { financeBaseInfo } from '../../../selectors/team/finance/financeBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { projectWithFinanceInfo } from '../../../selectors/project/projectWithFinance';
import { entityBase } from '../../../selectors/entityBase';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertFinanceMutation = typedGql('mutation')({
  insertFinanceOne: [
    { object: $('object', 'FinanceInsertInput!') as ValueTypes['FinanceInsertInput'] },
    { ...financeBaseInfo, team: { ...entityBase, projects: [{}, projectWithFinanceInfo] } }, // TODO: replace by merge
  ],
});
