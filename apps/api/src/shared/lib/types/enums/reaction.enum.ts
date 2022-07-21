import { registerEnumType } from '@nestjs/graphql';

export enum AllReaction {
  What = 'what',
  Interesting = 'interesting',
  Like = 'like',
  NotAnIssue = 'not-an-issue',
  Bump = 'bump',
  Laugh = 'laugh',
  Unsure = 'unsure',
  Partial = 'partial',
  Perfect = 'perfect',
}

registerEnumType(AllReaction, { name: 'AllReactionValue' });
