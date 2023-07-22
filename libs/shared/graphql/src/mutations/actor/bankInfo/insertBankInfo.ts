import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import { bankInfoBase } from '../../../selectors/actor/bankInfo/bankInfoBase';
import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertBankInfoMutation = typedGql('mutation')({
  insertBankInfoOne: [
    { object: $('object', 'BankInfoInsertInput!') as ValueTypes['BankInfoInsertInput'] },
    bankInfoBase,
  ],
});
