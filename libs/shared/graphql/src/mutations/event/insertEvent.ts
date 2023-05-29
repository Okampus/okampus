import { eventBaseInfo } from '../../selectors/event/eventBase';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

export const insertEventMutation = typedGql('mutation')({
  insertEventOne: [
    { object: $('insert', 'EventInsertInput!') as ValueTypes['EventInsertInput'] },
    { ...eventBaseInfo, teamEvents: [{}, { team: { id: true, actor: { name: true } } }] },
  ],
});
