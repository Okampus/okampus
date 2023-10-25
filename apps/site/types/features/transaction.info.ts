import { Prisma } from '@prisma/client';

const transactionWithContext = Prisma.validator<Prisma.TransactionDefaultArgs>()({
  include: {
    attachments: true,
    payedBy: true,
    processedBy: { include: { actor: true } },
    createdBy: { include: { actor: true } },
    event: true,
    project: true,
    receivedBy: true,
  },
});

export type TransactionWithContext = Prisma.TransactionGetPayload<typeof transactionWithContext>;
