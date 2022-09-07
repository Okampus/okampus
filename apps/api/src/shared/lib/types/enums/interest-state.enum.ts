import { registerEnumType } from '@nestjs/graphql';

export enum InterestState {
  Nope = 'Nope',
  Like = 'Like',
  SuperLike = 'SuperLike',
}

registerEnumType(InterestState, { name: 'InterestState' });
