import type { Favorite } from '../favorites/favorite.entity';
import type { Reaction } from '../reactions/reaction.entity';
import type { Report } from '../reports/report.entity';
import type { Vote } from '../votes/vote.entity';

export interface ThreadInteractions {
  favorites: Favorite[];
  votes: Vote[];
  reactions: Reaction[];
  reports: Report[];
}
