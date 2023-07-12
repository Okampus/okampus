import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import { addressBaseInfo } from '../../../selectors/actor/address/addressBase';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertAddressMutation = typedGql('mutation')({
  insertAddressOne: [
    { object: $('object', 'AddressInsertInput!') as ValueTypes['AddressInsertInput'] },
    addressBaseInfo,
  ],
});
