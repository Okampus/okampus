import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { documentBaseInfo } from '../../selectors/document/documentBase';
import type { ValueTypes } from '../../zeus';

export const insertDocumentMutation = typedGql('mutation')({
  insertDocumentOne: [
    { object: $('insert', 'DocumentInsertInput!') as ValueTypes['DocumentInsertInput'] },
    documentBaseInfo,
  ],
});
