import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { eventJoinBaseInfo } from '../../../selectors/event/eventJoin/eventJoinBase';
import { eventJoinDetailsInfo } from '../../../selectors/event/eventJoin/eventJoinDetails';

import { eventBaseInfo } from '../../../selectors/event/eventBase';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertEventJoinMutation = typedGql('mutation')({
  insertEventJoinOne: [
    { object: $('object', 'EventJoinInsertInput!') as ValueTypes['EventJoinInsertInput'] },
    {
      ...eventJoinDetailsInfo,
      event: { ...eventBaseInfo, eventJoins: [{}, eventJoinBaseInfo] },
    },
  ],
});
