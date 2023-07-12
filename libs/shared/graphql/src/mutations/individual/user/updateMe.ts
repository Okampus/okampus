import { userMeInfo } from '../../../selectors/individual/userMe';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import { id } from '../../id';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const updateMe = typedGql('mutation')({
  updateUserByPk: [{ pkColumns: { id }, _set: $('update', 'UserSetInput!') as ValueTypes['UserSetInput'] }, userMeInfo],
});
