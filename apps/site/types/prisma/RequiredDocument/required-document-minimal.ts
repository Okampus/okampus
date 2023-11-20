import { Prisma } from '@prisma/client';

export const requiredDocumentMinimal = Prisma.validator<Prisma.RequiredDocumentDefaultArgs>()({
  select: { id: true, name: true, description: true, teamTypes: true, isRequired: true },
});

export type RequiredDocumentMinimal = Prisma.RequiredDocumentGetPayload<typeof requiredDocumentMinimal>;
