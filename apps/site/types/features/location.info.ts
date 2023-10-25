import { addressMinimal } from './address.info';
import { Prisma } from '@prisma/client';

export const locationMinimal = Prisma.validator<Prisma.LocationDefaultArgs>()({
  include: { address: addressMinimal },
  select: {
    link: true,
    name: true,
    type: true,
  },
});

export type LocationMinimal = Prisma.LocationGetPayload<typeof locationMinimal>;
