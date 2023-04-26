import { userMeInfo } from '../../../selectors/individual/userMe';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';

export const updateMe = typedGql('mutation')({
  updateUserInfoByPk: [{ pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'UserInfoSetInput!') }, userMeInfo],
});
