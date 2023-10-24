import { ActorType } from '@prisma/client';

export const AVATAR_TEAM_ROUNDED = 15;
export const AVATAR_USER_ROUNDED = 50;

export function getAvatarRounded(type?: ActorType) {
  if (type === ActorType.User) return AVATAR_USER_ROUNDED;
  if (type === ActorType.Team) return AVATAR_TEAM_ROUNDED;
  return 0;
}
