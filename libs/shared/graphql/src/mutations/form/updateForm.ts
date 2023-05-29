import { formBaseInfo } from '../../selectors/form/formBase';
import { typedGql } from '../../zeus/typedDocumentNode';
import { $ } from '../../zeus';
import type { ValueTypes } from '../../zeus';

export const updateFormBase = typedGql('mutation')({
  updateFormByPk: [
    { pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'FormSetInput!') as ValueTypes['FormSetInput'] },
    formBaseInfo,
  ],
});
