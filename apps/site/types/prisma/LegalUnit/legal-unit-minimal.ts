import { actorMinimal } from '../Actor/actor-minimal';
import { addressMinimal } from '../Address/address-minimal';
import { Prisma } from '@prisma/client';

export const legalUnitMinimal = Prisma.validator<Prisma.LegalUnitDefaultArgs>()({
  select: {
    legalName: true,
    slug: true,
    actor: actorMinimal,
    address: addressMinimal,
    uniqueCodes: { select: { code: true, codeType: true, country: true } },
  },
});

export type LegalUnitMinimal = Prisma.LegalUnitGetPayload<typeof legalUnitMinimal>;
