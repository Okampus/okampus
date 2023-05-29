import { formBaseInfo } from '../../../selectors/form/formBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';
import type { ValueTypes } from '../../../zeus';

export const updateEventJoinMutation = typedGql('mutation')({
  updateEventJoinByPk: [
    {
      pkColumns: { id: $('id', 'bigint!') },
      _set: $('update', 'EventJoinSetInput!') as ValueTypes['EventJoinSetInput'],
    },
    formBaseInfo,
  ],
});
