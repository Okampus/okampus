import { DEFAULT_EVENT_NAMES_BY_CATEGORY } from '../seeders/defaults';
import { pickOneRandom, randomEnum, randomInt } from '@okampus/shared/utils';
import { ApprovalState, ProcessedVia } from '@okampus/shared/enums';
import { faker } from '@faker-js/faker';
import type { DefaultCategories } from '../seeders/defaults';
import type { Prisma } from '@prisma/client';

export function fakeApproval(approved: boolean): ApprovalState {
  if (approved) return Math.random() > 0.75 ? ApprovalState.Approved : ApprovalState.Canceled;
  return Math.random() > 0.5 ? ApprovalState.Pending : ApprovalState.Rejected;
}

export const fakeText = () => faker.lorem.paragraph(randomInt(1, 4));
export const fakeProjectBudget = () => randomInt(50, 400) * 10;
export const fakeEventName = (categories: DefaultCategories[]) =>
  pickOneRandom(DEFAULT_EVENT_NAMES_BY_CATEGORY[pickOneRandom(categories)]);

type GetPresencePayloadReturn =
  | {
      isPresent: Prisma.EventJoinUncheckedCreateInput['isPresent'];
      participationProcessedAt: Prisma.EventJoinUncheckedCreateInput['participationProcessedAt'];
      participationProcessedById: Prisma.EventJoinUncheckedCreateInput['participationProcessedById'];
      participationProcessedVia: Prisma.EventJoinUncheckedCreateInput['participationProcessedVia'];
    }
  | undefined;

export function getPresencePayload(presence: null | boolean, managerId: bigint): GetPresencePayloadReturn {
  if (presence === null) return;

  const participationData = { participationProcessedAt: new Date(), participationProcessedById: managerId };
  if (presence === false)
    return { isPresent: false, ...participationData, participationProcessedVia: ProcessedVia.Manual };

  const participationProcessedVia = randomEnum(ProcessedVia);
  return { isPresent: true, ...participationData, participationProcessedVia };
}
