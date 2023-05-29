import { changeRoleBaseInfo } from '../../../selectors/team/changeRole/changeRoleBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../../zeus';

// @ts-expect-error - Zeus depth limit
export const insertChangeRole = typedGql('mutation')({
  insertChangeRoleOne: [
    { object: $('insert', 'ChangeRoleInsertInput!') as ValueTypes['ChangeRoleInsertInput'] },
    changeRoleBaseInfo,
  ],
});
