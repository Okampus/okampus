import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { documentBaseInfo } from '../../selectors/document/documentBase';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertDocumentMutation = typedGql('mutation')({
  insertDocumentOne: [
    { object: $('object', 'DocumentInsertInput!') as ValueTypes['DocumentInsertInput'] },
    documentBaseInfo,
  ],
});
