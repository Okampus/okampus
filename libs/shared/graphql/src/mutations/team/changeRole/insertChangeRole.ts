import { changeRoleBaseInfo } from '../../../selectors/team/changeRole/changeRoleBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertChangeRole = typedGql('mutation')({
  insertChangeRoleOne: [
    { object: $('object', 'ChangeRoleInsertInput!') as ValueTypes['ChangeRoleInsertInput'] },
    changeRoleBaseInfo,
  ],
});
