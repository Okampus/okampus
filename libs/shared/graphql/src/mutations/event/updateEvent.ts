import { $ } from '../../zeus';
import { id } from '../id';
import { typedGql } from '../../zeus/typedDocumentNode';
import { eventManageInfo } from '../../selectors/event/eventManage';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const updateEventMutation = typedGql('mutation')({
  updateEventByPk: [
    { pkColumns: { id }, _set: $('update', 'EventSetInput!') as ValueTypes['EventSetInput'] },
    eventManageInfo,
  ],
});
