import { fakeText } from './faker-utils';
import { prisma } from '../db';
import { pickOneRandom, randomInt } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import { ApprovalState } from '@prisma/client';

type FakeActionOptions = {
  tenantScopeId: bigint;
  managers: { id: bigint }[];
  projectId?: bigint;
  teamId: bigint;
  userId: bigint;
};

export async function fakeAction({ tenantScopeId, managers, projectId, teamId, userId }: FakeActionOptions) {
  const name = faker.person.jobTitle();
  const processedById = pickOneRandom(managers).id;

  let processed: { state: ApprovalState; points?: number; processedById?: bigint; processedAt?: Date };
  if (Math.random() > 0.5) {
    processed = { state: ApprovalState.Approved, points: randomInt(1, 5), processedById, processedAt: new Date() };
  } else if (Math.random() > 0.35) {
    processed = { state: ApprovalState.Rejected, processedById, processedAt: new Date() };
  } else if (Math.random() > 0.25) {
    processed = { state: ApprovalState.Canceled };
  } else {
    processed = { state: ApprovalState.Pending };
  }

  const actionData = { name, description: fakeText() };
  const createdById = processed.state === ApprovalState.Approved && Math.random() > 0.5 ? processedById : userId;

  return await prisma.action.create({
    data: { ...actionData, ...processed, projectId, teamId, userId, createdById, tenantScopeId },
  });
}
