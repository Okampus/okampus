import { eventJoinDetailsInfo } from '../../../selectors/event/eventJoin/eventJoinDetails';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import { id } from '../../id';

import type { ValueTypes } from '../../../zeus';

export const updateEventJoinMutation = typedGql('mutation')({
  updateEventJoinByPk: [
    { pkColumns: { id }, _set: $('update', 'EventJoinSetInput!') as ValueTypes['EventJoinSetInput'] },
    eventJoinDetailsInfo,
  ],
});
