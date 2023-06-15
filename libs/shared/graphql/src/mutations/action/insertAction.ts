import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { actionBaseInfo } from '../../selectors/team/action/actionBase';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertActionMutation = typedGql('mutation')({
  insertActionOne: [{ object: $('insert', 'ActionInsertInput!') as ValueTypes['ActionInsertInput'] }, actionBaseInfo],
});
