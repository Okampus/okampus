import { eventBaseInfo } from '../../selectors/event/eventBase';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertEventMutation = typedGql('mutation')({
  insertEventOne: [
    { object: $('insert', 'EventInsertInput!') as ValueTypes['EventInsertInput'] },
    { ...eventBaseInfo, teamEvents: [{}, { team: { id: true, actor: { name: true } } }] },
  ],
});
