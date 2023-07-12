import { $ } from '../../zeus';
import { id } from '../id';
import { typedGql } from '../../zeus/typedDocumentNode';
import { eventManageBaseInfo } from '../../selectors/event/eventManageBase';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const updateEventMutation = typedGql('mutation')({
  updateEventByPk: [
    { pkColumns: { id }, _set: $('update', 'EventSetInput!') as ValueTypes['EventSetInput'] },
    eventManageBaseInfo,
  ],
});
