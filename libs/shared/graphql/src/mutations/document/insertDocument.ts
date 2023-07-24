import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { documentBaseInfo } from '../../selectors/document/documentBase';
import type { ValueTypes } from '../../zeus';

// @ts-ignore
export const insertDocumentMutation = typedGql('mutation')({
  insertDocumentOne: [
    { object: $('object', 'DocumentInsertInput!') as ValueTypes['DocumentInsertInput'] },
    documentBaseInfo,
  ],
});
