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
  eventTags: { tag: { name: string } }[];
  eventJoins: { joinedBy: UserMinimalInfo }[];
  eventJoinsAggregate: { aggregate?: { count: number } | null };
};

export type EventDetailsInfo = EventMinimalInfo & {
  description: string;
  location?: LocationMinimalInfo | null;
  eventOrganizes: {
    team: TeamMinimalInfo;
    eventSupervisors: { user: UserMinimalInfo }[];
  }[];
};
