import { formBaseInfo } from '../../selectors/form/formBase';
import { typedGql } from '../../zeus/typedDocumentNode';
import { $ } from '../../zeus';
import { id } from '../id';
import type { ValueTypes } from '../../zeus';

export const updateFormMutation = typedGql('mutation')({
  updateFormByPk: [
    { pkColumns: { id }, _set: $('update', 'FormSetInput!') as ValueTypes['FormSetInput'] },
    formBaseInfo,
  ],
});
