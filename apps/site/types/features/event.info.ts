import type { LocationMinimalInfo } from './location.info';
import type { TeamMinimalInfo } from './team.info';
import type { UserMinimalInfo } from './user.info';

export type EventMinimalInfo = {
  id: string;
  name: string;
  slug: string;
  start: string;
  end: string;
  price: number;
  pointsAwardedForAttendance: number;
  banner?: { url: string } | null;
  eventJoins: { joinedBy: UserMinimalInfo }[];
  eventJoinsAggregate: { aggregate?: { count: number } | null };
};

export type EventWithTeamInfo = EventMinimalInfo & {
  eventOrganizes: {
    team: TeamMinimalInfo;
  }[];
};

export type EventDetailsInfo = EventWithTeamInfo & {
  description: string;
  eventOrganizes: {
    team: TeamMinimalInfo;
    eventSupervisors: { teamMember: { user: UserMinimalInfo } }[];
  }[];
  location?: LocationMinimalInfo | null;
};
