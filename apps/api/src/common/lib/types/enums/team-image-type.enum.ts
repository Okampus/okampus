import { registerEnumType } from '@nestjs/graphql';

export enum TeamImageType {
  Logo = 'Logo',
  LogoDark = 'LogoDark',
  Banner = 'Banner',
  Profile = 'Profile',
  Sticker = 'Sticker',
  Other = 'Other',
}

registerEnumType(TeamImageType, { name: 'TeamImageType' });
