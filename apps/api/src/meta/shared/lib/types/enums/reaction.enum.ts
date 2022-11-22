import { registerEnumType } from '@nestjs/graphql';

export enum AllReaction {
  What = 'What',
  Interesting = 'Interesting',
  Like = 'Like',
  NotAnIssue = 'NotAnIssue',
  Bump = 'Bump',
  Laugh = 'Laugh',
  Unsure = 'Unsure',
  Partial = 'Partial',
  Perfect = 'Perfect',
}

registerEnumType(AllReaction, { name: 'AllReactionValue' });
