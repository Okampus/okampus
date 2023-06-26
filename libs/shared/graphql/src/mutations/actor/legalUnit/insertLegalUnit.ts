import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import { legalUnitMinimalInfo } from '../../../selectors/actor/legalUnit/legalUnitMinimal';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertLegalUnitMutation = typedGql('mutation')({
  insertLegalUnitOne: [
    { object: $('object', 'LegalUnitInsertInput!') as ValueTypes['LegalUnitInsertInput'] },
    legalUnitMinimalInfo,
  ],
});
