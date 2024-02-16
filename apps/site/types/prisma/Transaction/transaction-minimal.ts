import { actorMinimal } from '../Actor/actor-minimal';
import { teamMemberMinimal } from '../TeamMember/team-member-minimal';
import { teamVendorMinimal } from '../TeamVendor/team-vendor-minimal';
import { userMinimal } from '../User/user-minimal';
import { Prisma } from '@prisma/client';

export const transactionMinimal = Prisma.validator<Prisma.TransactionDefaultArgs>()({
  select: {
    id: true,
    attachments: true,
    liableTeamMember: teamMemberMinimal,
    isLiableTeamMemberUnsure: true,
    createdBy: userMinimal,
    event: true,
    project: true,
    counterPartyActor: actorMinimal,
    counterPartyActorType: true,
    counterPartyTeamVendor: teamVendorMinimal,
    counterPartyName: true,
    paymentMethod: true,
    teamPaymentMethod: true,
    transactionType: true,
    teamTransactionType: true,
    createdAt: true,
    payedAt: true,
    amount: true,
    isOnline: true,
    wording: true,
    note: true,
    referenceNumber: true,
    team: { select: { id: true, actorId: true, slug: true } },
    moneyAccountId: true,
    bankTransactions: true,
  },
});

export type TransactionMinimal = Prisma.TransactionGetPayload<typeof transactionMinimal>;
