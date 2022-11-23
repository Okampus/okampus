import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  User = 'user',
  Moderator = 'moderator',
  RestaurantManager = 'restaurant-manager',
  ClubManager = 'club-manager',
  Admin = 'admin',
}

registerEnumType(Role, { name: 'Role' });
