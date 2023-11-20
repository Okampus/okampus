import { addressMinimal } from '../Address/address-minimal';
import { formMinimal } from '../Form/form-minimal';
import { linkMinimal } from '../Link/link-minimal';
import { tenantLocationMinimal } from '../TenantLocation/tenant-location-minimal';

import { Prisma } from '@prisma/client';

export const eventMinimal = Prisma.validator<Prisma.EventDefaultArgs>()({
  select: {
    _count: { select: { eventJoins: true } },
    id: true,
    name: true,
    slug: true,
    start: true,
    end: true,
    price: true,
    summary: true,
    pointsAwardedForAttendance: true,
    banner: true,
    maxParticipants: true,
    address: addressMinimal,
    tenantLocation: tenantLocationMinimal,
    locationDetails: true,
    locationLink: linkMinimal,
    joinForm: formMinimal,
  },
});

export type EventMinimal = Prisma.EventGetPayload<typeof eventMinimal>;
