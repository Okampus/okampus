import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { eventJoinWithEventInfo } from '../../../selectors/event/eventJoin/eventJoinWithEvent';

import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertEventJoinMutation = typedGql('mutation')({
  insertEventJoinOne: [
    { object: $('object', 'EventJoinInsertInput!') as ValueTypes['EventJoinInsertInput'] },
    eventJoinWithEventInfo,
  ],
});
