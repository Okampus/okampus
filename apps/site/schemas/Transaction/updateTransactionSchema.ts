import { ActorType, PaymentMethod, TransactionType } from '@prisma/client';
import { z } from 'zod';

export const updateTransactionSchema = z
  .object({
    transactionId: z.coerce.bigint().optional(),
    moneyAccountId: z.coerce.bigint().optional(),
    tagIds: z.array(z.coerce.bigint()).optional(),
    isIncome: z.boolean(),
    payedAt: z.string(),
    amount: z.number().refine((amount) => amount * 100 - Math.trunc(amount * 100) < Number.EPSILON), // Ensures that the amount has at most 2 decimal places
    projectId: z.coerce.bigint().optional(),
    eventId: z.coerce.bigint().optional(),
    locationId: z.coerce.bigint().optional(),
    wording: z.string().optional(),
    liableTeamMemberId: z.coerce.bigint().optional(),
    isLiableTeamMemberUnsure: z.boolean().optional(),
    counterPartyActorId: z.bigint().optional(),
    counterPartyName: z.string().optional(),
    counterPartyActorType: z.nativeEnum(ActorType).nullable(),
    description: z.string().optional(),
    iban: z.string().optional(),
    transactionType: z.nativeEnum(TransactionType).or(z.coerce.bigint().optional()),
    paymentMethod: z.nativeEnum(PaymentMethod).or(z.coerce.bigint().optional()),
    attachments: z.array(z.coerce.bigint()).optional(),
  })
  .refine((data) => !data.transactionId && !data.moneyAccountId, {
    message: 'Either transactionId or moneyAccountId must be provided',
    path: ['moneyAccountId'],
  });
