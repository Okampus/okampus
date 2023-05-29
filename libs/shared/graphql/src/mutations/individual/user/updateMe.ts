import { userMeInfo } from '../../../selectors/individual/userMe';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import type { ValueTypes } from '../../../zeus';

export const updateMe = typedGql('mutation')({
  updateUserInfoByPk: [
    { pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'UserInfoSetInput!') as ValueTypes['UserInfoSetInput'] },
    userMeInfo,
  ],
});
