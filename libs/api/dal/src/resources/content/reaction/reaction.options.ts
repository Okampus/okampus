import type { Content } from '../content.entity';
import type { ReactionProps } from './reaction.props';

export type ReactionOptions = ReactionProps & {
  content?: Content | null;
};
