import { Prisma } from '@prisma/client';

export const addressMinimal = Prisma.validator<Prisma.AddressDefaultArgs>()({
  select: {
    geoapifyId: true,
    latitude: true,
    longitude: true,
    category: true,
    name: true,
    streetNumber: true,
    street: true,
    zip: true,
    city: true,
    state: true,
    country: true,
  },
});

export type AddressMinimal = Prisma.AddressGetPayload<typeof addressMinimal>;
