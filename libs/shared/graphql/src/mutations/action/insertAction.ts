import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { actionBaseInfo } from '../../selectors/team/action/actionBase';
import type { ValueTypes } from '../../zeus';

// @ts-ignore
export const insertActionMutation = typedGql('mutation')({
  insertActionOne: [{ object: $('object', 'ActionInsertInput!') as ValueTypes['ActionInsertInput'] }, actionBaseInfo],
});
