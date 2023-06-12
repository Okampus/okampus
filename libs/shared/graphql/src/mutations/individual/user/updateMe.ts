import { userMeInfo } from '../../../selectors/individual/userMe';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import { id } from '../../id';
import type { ValueTypes } from '../../../zeus';

export const updateMe = typedGql('mutation')({
  updateUserInfoByPk: [
    { pkColumns: { id }, _set: $('update', 'UserInfoSetInput!') as ValueTypes['UserInfoSetInput'] },
    userMeInfo,
  ],
});
