import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import { legalUnitLocationMinimalInfo } from '../../../selectors/actor/legalUnitLocation/legalUnitLocationMinimal';
import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertLegalUnitLocationMutation = typedGql('mutation')({
  insertLegalUnitLocationOne: [
    { object: $('object', 'LegalUnitLocationInsertInput!') as ValueTypes['LegalUnitLocationInsertInput'] },
    legalUnitLocationMinimalInfo,
  ],
});
