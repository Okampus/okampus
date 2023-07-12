import { teamJoinBaseInfo } from '../../../selectors/team/teamJoin/teamJoinBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertTeamJoin = typedGql('mutation')({
  insertTeamJoinOne: [
    { object: $('object', 'TeamJoinInsertInput!') as ValueTypes['TeamJoinInsertInput'] },
    teamJoinBaseInfo,
  ],
});
