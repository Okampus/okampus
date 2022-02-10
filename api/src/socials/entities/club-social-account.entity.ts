import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Expose } from 'class-transformer';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Club } from '../../clubs/entities/club.entity';
import { CLUB_SOCIALS_INCLUDED } from '../../shared/lib/constants';
import { SocialAccount } from './social-account.entity';
import type { Social } from './social.entity';

@Entity({ discriminatorValue: 'club' })
export class ClubSocialAccount extends SocialAccount {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Expose({ groups: [CLUB_SOCIALS_INCLUDED] })
  @Index()
  club!: Club;

  constructor(options: {
    social: Social;
    link?: string;
    pseudo: string;
    club: Club;
  }) {
    super(options);
    this.club = options.club;
  }
}
