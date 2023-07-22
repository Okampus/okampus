import { teamJoinBaseInfo } from '../../../selectors/team/teamJoin/teamJoinBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertTeamJoinMutation = typedGql('mutation')({
  insertTeamJoinOne: [
    { object: $('object', 'TeamJoinInsertInput!') as ValueTypes['TeamJoinInsertInput'] },
    teamJoinBaseInfo,
  ],
});
