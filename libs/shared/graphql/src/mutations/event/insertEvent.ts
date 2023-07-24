import { eventBaseInfo } from '../../selectors/event/eventBase';
import { eventOrganizeDetailsInfo } from '../../selectors/event/eventOrganize/eventOrganizeDetails';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// @ts-ignore
export const insertEventMutation = typedGql('mutation')({
  insertEventOne: [
    { object: $('object', 'EventInsertInput!') as ValueTypes['EventInsertInput'] },
    { ...eventBaseInfo, eventOrganizes: [{}, eventOrganizeDetailsInfo] },
  ],
});
