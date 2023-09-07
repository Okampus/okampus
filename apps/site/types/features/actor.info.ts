import type { SocialInfo } from './social.info';

export type ActorMinimalInfo = {
  id: string;
  name: string;
  website: string | null;
  avatar: string | null;
  banner: string | null;
};

export type ActorBaseInfo = ActorMinimalInfo & {
  bio: string;
  email: string | null;
  status: string;
  socials: SocialInfo[];
};

export type ActorTeamUserInfo = ActorMinimalInfo & {
  team: { id: string; slug: string } | null;
  user: { id: string; slug: string } | null;
};
