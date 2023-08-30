import type { TeamMinimalInfo } from './team.info';
import type { UserMinimalInfo } from './user.info';
import type { SocialInfo } from './social.info';

export type ActorMinimalInfo = {
  id: string;
  slug: string;
  name: string;
  website: string;
  avatar: string;
  banner: string;
};

export type ActorBaseInfo = ActorMinimalInfo & {
  bio: string;
  email: string;
  status: string;
  socials: SocialInfo[];
};

export type ActorTeamUserInfo = ActorMinimalInfo & {
  team?: Omit<TeamMinimalInfo, 'actor'> | null;
  user?: Omit<UserMinimalInfo, 'actor'> | null;
};
