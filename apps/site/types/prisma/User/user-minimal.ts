import { actorWithTags } from '../Actor/actor-with-tags';
import { Prisma } from '@prisma/client';

export const userMinimal = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true, slug: true, firstName: true, lastName: true, actor: actorWithTags },
});

export type UserMinimal = Prisma.UserGetPayload<typeof userMinimal>;
