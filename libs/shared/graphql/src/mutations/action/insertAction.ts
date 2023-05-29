import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { actionBaseInfo } from '../../selectors/team/action/actionBase';
import type { ValueTypes } from '../../zeus';

// @ts-expect-error - Zeus depth limit
export const insertActionMutation = typedGql('mutation')({
  insertActionOne: [{ object: $('insert', 'ActionInsertInput!') as ValueTypes['ActionInsertInput'] }, actionBaseInfo],
});
