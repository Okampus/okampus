import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import { legalUnitLocationMinimalInfo } from '../../../selectors/actor/legalUnitLocation/legalUnitLocationMinimal';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertLegalUnitLocationMutation = typedGql('mutation')({
  insertLegalUnitLocationOne: [
    { object: $('object', 'LegalUnitLocationInsertInput!') as ValueTypes['LegalUnitLocationInsertInput'] },
    legalUnitLocationMinimalInfo,
  ],
});
