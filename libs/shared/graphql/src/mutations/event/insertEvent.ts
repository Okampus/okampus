import { eventBaseInfo } from '../../selectors/event/eventBase';
import { eventManageDetailsInfo } from '../../selectors/event/eventManage/eventManageDetails';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertEventMutation = typedGql('mutation')({
  insertEventOne: [
    { object: $('object', 'EventInsertInput!') as ValueTypes['EventInsertInput'] },
    { ...eventBaseInfo, eventManages: [{}, eventManageDetailsInfo] },
  ],
});
