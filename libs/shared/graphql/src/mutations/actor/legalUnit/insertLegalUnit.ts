import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import { legalUnitMinimalInfo } from '../../../selectors/actor/legalUnit/legalUnitMinimal';
import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertLegalUnitMutation = typedGql('mutation')({
  insertLegalUnitOne: [
    { object: $('object', 'LegalUnitInsertInput!') as ValueTypes['LegalUnitInsertInput'] },
    legalUnitMinimalInfo,
  ],
});
