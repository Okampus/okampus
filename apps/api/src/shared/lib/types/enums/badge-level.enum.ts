import { registerEnumType } from '@nestjs/graphql';

export enum BadgeLevel {
  Bronze = 1,
  Silver = 2,
  Gold = 3,
}

registerEnumType(BadgeLevel, { name: 'BadgeLevel' });
