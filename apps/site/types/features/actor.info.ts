import type { SocialInfo } from './social.info';

export type ActorMinimalInfo = {
  id: string;
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
  team: {
    id: string;
    slug: string;
  } | null;
  user: {
    id: string;
    slug: string;
  } | null;
};
