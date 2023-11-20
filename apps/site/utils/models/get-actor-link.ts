import { ActorType } from '@prisma/client';
import type { ActorMinimal } from '../../types/prisma/Actor/actor-minimal';

export function getActorLink(actor: ActorMinimal, slug: string) {
  if (actor.type === ActorType.User) return `/user/${slug}`;
  if (actor.type === ActorType.Team) return `/team/${slug}`;
  if (actor.type === ActorType.Tenant) return `/tenant`;
  // if (actor.type === ActorType.Bank) return `/bank/${slug}`;
  // if (actor.type === ActorType.LegalUnit) return `/company/${slug}`;
  return '/';
}
