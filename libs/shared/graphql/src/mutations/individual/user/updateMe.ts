import { userLoginInfo } from '../../../selectors/individual/userLogin';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import { id } from '../../id';
import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const updateMeMutation = typedGql('mutation')({
  updateUserByPk: [
    { pkColumns: { id }, _set: $('update', 'UserSetInput!') as ValueTypes['UserSetInput'] },
    userLoginInfo,
  ],
});
