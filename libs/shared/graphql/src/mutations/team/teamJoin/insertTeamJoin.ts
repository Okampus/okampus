import { teamJoinBaseInfo } from '../../../selectors/team/teamJoin/teamJoinBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';

export const insertTeamJoin = typedGql('mutation')({
  insertTeamJoinOne: [{ object: $('insert', 'TeamJoinInsertInput!') }, teamJoinBaseInfo],
});
