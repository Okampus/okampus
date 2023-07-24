import { accountBaseInfo } from '../../../selectors/team/account/accountBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertAccountMutation = typedGql('mutation')({
  insertAccountOne: [
    { object: $('object', 'AccountInsertInput!') as ValueTypes['AccountInsertInput'] },
    accountBaseInfo,
  ],
});
