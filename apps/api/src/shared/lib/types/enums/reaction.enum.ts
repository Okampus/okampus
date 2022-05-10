import type { ValueOf } from '../types/valueof.type';

const BaseReaction = {
  what: 'what',
  interesting: 'interesting',
  like: 'like',
} as const;

export const ThreadPostReaction = {
  ...BaseReaction,
  laugh: 'laugh',
  notAnIssue: 'notanissue',
  bump: 'bump',
} as const;

export const ReplyReaction = {
  ...BaseReaction,
  laugh: 'laugh',
  unsure: 'unsure',
  partial: 'partial',
  perfect: 'perfect',
} as const;

export const BlogPostReaction = {
  ...BaseReaction,
  laugh: 'laugh',
  perfect: 'perfect',
} as const;

export const AllReaction = {
  ...ThreadPostReaction,
  ...ReplyReaction,
  ...BlogPostReaction,
} as const;

export type BaseReactionValue = ValueOf<typeof BaseReaction>;

export type ThreadPostReactionValue = ValueOf<typeof ThreadPostReaction>;
export type ReplyReactionValue = ValueOf<typeof ReplyReaction>;
export type BlogPostReactionValue = ValueOf<typeof BlogPostReaction>;

export type AllReactionValue = BaseReactionValue | BlogPostReactionValue | ReplyReactionValue | ThreadPostReactionValue;
