import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { eventManageBaseInfo } from '../../selectors/event/eventManageBase';
import type { ValueTypes } from '../../zeus';

export const updateEventMutation = typedGql('mutation')({
  updateEventByPk: [
    {
      pkColumns: { id: $('id', 'bigint!') },
      _set: $('update', 'EventSetInput!') as ValueTypes['EventSetInput'],
    },
    eventManageBaseInfo,
  ],
});
