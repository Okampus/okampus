import type { EventOrganizeMinimalInfo } from './event-organizes.info';
import type { TeamMinimalInfo } from './team.info';

export type ProjectMinimalInfo = {
  name: string;
  slug: string;
};

export type ProjectDetailsInfo = ProjectMinimalInfo & {
  banner: {
    id: string;
    url: string;
  };
  description: string;
  team: TeamMinimalInfo;
  eventOrganizes: EventOrganizeMinimalInfo[];
};
