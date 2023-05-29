import { teamJoinBaseInfo } from '../../../selectors/team/teamJoin/teamJoinBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../../zeus';

// @ts-expect-error - Zeus depth limit
export const insertTeamJoin = typedGql('mutation')({
  insertTeamJoinOne: [
    { object: $('insert', 'TeamJoinInsertInput!') as ValueTypes['TeamJoinInsertInput'] },
    teamJoinBaseInfo,
  ],
});
