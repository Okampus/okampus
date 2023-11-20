import { legalUnitMinimal } from '../LegalUnit/legal-unit-minimal';
import { Prisma } from '@prisma/client';

export const legalUnitUniqueCodeMinimal = Prisma.validator<Prisma.LegalUnitUniqueCodeDefaultArgs>()({
  select: { code: true, codeType: true, country: true, legalUnit: legalUnitMinimal },
});

export type LegalUnitUniqueCodeMinimal = Prisma.LegalUnitUniqueCodeGetPayload<typeof legalUnitUniqueCodeMinimal>;
