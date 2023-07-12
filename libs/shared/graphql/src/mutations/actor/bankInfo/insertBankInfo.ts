import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import { bankInfoBase } from '../../../selectors/actor/bankInfo/bankInfoBase';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertBankInfoMutation = typedGql('mutation')({
  insertBankInfoOne: [
    { object: $('object', 'BankInfoInsertInput!') as ValueTypes['BankInfoInsertInput'] },
    bankInfoBase,
  ],
});
