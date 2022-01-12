import { Entity, ManyToOne } from '@mikro-orm/core';
import { Club } from '../../clubs/club.entity';
import { SocialAccount } from './social-account.entity';
import type { Social } from './social.entity';

@Entity({ discriminatorValue: 'club' })
export class ClubSocialAccount extends SocialAccount {
  @ManyToOne({ onDelete: 'CASCADE' })
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
