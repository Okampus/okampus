import { userMinimal } from './user-minimal';
import { actorWithSocials } from '../Actor/actor-with-socials';
import { Prisma } from '@prisma/client';

export const userDetails = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { ...userMinimal.select, firstName: true, lastName: true, createdAt: true, actor: actorWithSocials },
});

export type UserDetails = Prisma.UserGetPayload<typeof userDetails>;
