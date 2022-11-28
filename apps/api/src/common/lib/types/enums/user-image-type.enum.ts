import { registerEnumType } from '@nestjs/graphql';

export enum UserImageType {
  Avatar = 'Avatar',
  Banner = 'Banner',
  Profile = 'Profile',
  Other = 'Other',
}

registerEnumType(UserImageType, { name: 'UserImageType' });
