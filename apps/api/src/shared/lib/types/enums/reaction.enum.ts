import { registerEnumType } from '@nestjs/graphql';
// Import type { ValueOf } from '../types/valueof.type';

// Const BaseReaction = {
//   what: 'what',
//   interesting: 'interesting',
//   like: 'like',
// } as const;

// export const ThreadPostReaction = {
//   ...BaseReaction,
//   laugh: 'laugh',
//   notAnIssue: 'notanissue',
//   bump: 'bump',
// } as const;

// export const ReplyReaction = {
//   ...BaseReaction,
//   laugh: 'laugh',
//   unsure: 'unsure',
//   partial: 'partial',
//   perfect: 'perfect',
// } as const;

// export const BlogPostReaction = {
//   ...BaseReaction,
//   laugh: 'laugh',
//   perfect: 'perfect',
// } as const;

// export const AllReaction = {
//   ...ThreadPostReaction,
//   ...ReplyReaction,
//   ...BlogPostReaction,
// } as const;

// export type BaseReactionValue = ValueOf<typeof BaseReaction>;

// export type ThreadPostReactionValue = ValueOf<typeof ThreadPostReaction>;
// export type ReplyReactionValue = ValueOf<typeof ReplyReaction>;
// export type BlogPostReactionValue = ValueOf<typeof BlogPostReaction>;

// export type AllReactionValue = BaseReactionValue | BlogPostReactionValue |
// ReplyReactionValue | ThreadPostReactionValue;

export enum AllReaction {
  What = 'what',
  Interesting = 'interesting',
  Like = 'like',
  NotAnIssue = 'notanissue',
  Bump = 'bump',
  Laugh = 'laugh',
  Unsure = 'unsure',
  Partial = 'partial',
  Perfect = 'perfect',
}


registerEnumType(AllReaction, { name: 'AllReactionValue' });
