import { registerEnumType } from '@nestjs/graphql';

export enum BadgeLevel {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
}

registerEnumType(BadgeLevel, { name: 'BadgeLevel' });
