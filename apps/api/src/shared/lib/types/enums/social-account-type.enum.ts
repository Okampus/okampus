import { registerEnumType } from '@nestjs/graphql';

export enum SocialAccountType {
  Discord = 'Discord',
  Instagram = 'Instagram',
  YouTube = 'YouTube',
  TikTok = 'TikTok',
  Twitch = 'Twitch',
  LinkedIn = 'LinkedIn',
}

registerEnumType(SocialAccountType, { name: 'SocialAccountType' });
