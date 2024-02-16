import { legalUnitMinimal } from '../LegalUnit/legal-unit-minimal';

import { Prisma } from '@prisma/client';

export const teamVendorMinimal = Prisma.validator<Prisma.TeamVendorDefaultArgs>()({
  select: {
    id: true,
    name: true,
    brand: legalUnitMinimal,
    legalUnit: legalUnitMinimal,
    email: true,
    slug: true,
    website: true,
    phone: true,
  },
});

export type TeamVendorMinimal = Prisma.TeamVendorGetPayload<typeof teamVendorMinimal>;
