import type { ActorImageType, ActorType } from '@prisma/client';

export type ActorImageContext =
  | { actorType: 'Team'; actorImageType: ActorImageType; slug: string }
  | { actorType: Exclude<ActorType, 'Team'>; actorImageType: ActorImageType };
