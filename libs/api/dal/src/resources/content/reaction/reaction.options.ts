import type { Content } from '../content.entity';
import type { ReactionProps } from './reaction.props';

export type ReactionOptions = ReactionProps & {
  lastActiveDate?: Date | null;
  content?: Content | null;
};
