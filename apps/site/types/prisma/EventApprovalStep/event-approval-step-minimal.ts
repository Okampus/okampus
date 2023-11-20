import { Prisma } from '@prisma/client';

export const eventApprovalStepMinimal = Prisma.validator<Prisma.EventApprovalStepDefaultArgs>()({
  select: { id: true, name: true, order: true },
});

export type EventApprovalStepMinimal = Prisma.EventApprovalStepGetPayload<typeof eventApprovalStepMinimal>;
