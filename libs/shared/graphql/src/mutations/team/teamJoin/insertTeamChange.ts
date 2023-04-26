import { teamChangeRoleBaseInfo } from '../../../selectors/team/teamChangeRole/teamChangeRoleBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';

// @ts-expect-error - Zeus depth limit
export const insertTeamChangeRoleBase = typedGql('mutation')({
  insertTeamChangeRoleOne: [{ object: $('insert', 'TeamChangeRoleInsertInput!') }, teamChangeRoleBaseInfo],
});
