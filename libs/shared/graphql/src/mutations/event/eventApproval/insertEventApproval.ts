import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { eventApprovalBaseInfo } from '../../../selectors/tenant/eventApproval/eventApprovalBase';
import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertEventApprovalMutation = typedGql('mutation')({
  insertEventApprovalOne: [
    { object: $('object', 'EventApprovalInsertInput!') as ValueTypes['EventApprovalInsertInput'] },
    eventApprovalBaseInfo,
  ],
});
