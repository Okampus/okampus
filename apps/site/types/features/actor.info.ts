import type { TeamMinimalInfo } from './team.info';
import type { UserMinimalInfo } from './user.info';
import type { ActorImageMinimalInfo } from './actor-image.info';
import type { SocialInfo } from './social.info';

export type ActorMinimalInfo = {
  id: string;
  slug: string;
  name: string;
  email: string;
  website: string;
  actorImages: ActorImageMinimalInfo[];
};

export type ActorBaseInfo = ActorMinimalInfo & {
  bio: string;
  status: string;
  socials: SocialInfo[];
};

export type ActorTeamIndividualInfo = ActorMinimalInfo & {
  team?: Omit<TeamMinimalInfo, 'actor'> | null;
  individual?: {
    user?: Omit<UserMinimalInfo, 'individual'> | null;
  } | null;
};
