import type { Content } from '../content.entity';
import type { ReactionProps } from '@okampus/shared/dtos';

export type ReactionOptions = ReactionProps & {
  lastActiveDate?: Date | null;
  content?: Content | null;
};
