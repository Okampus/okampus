import { fakeText } from './faker-utils';
import prisma from '../db';

type FakeEventApprovalOptions = {
  event: { id: bigint; tenantScopeId: bigint };
  stepId: bigint;
  tenantAdminId: bigint;
  isApproved: boolean;
};

export async function fakeEventApproval({ event, stepId, tenantAdminId, isApproved }: FakeEventApprovalOptions) {
  return await prisma.eventApproval.create({
    data: {
      eventId: event.id,
      eventApprovalStepId: stepId,
      message: fakeText(),
      isApproved,
      createdById: tenantAdminId,
    },
  });
}
