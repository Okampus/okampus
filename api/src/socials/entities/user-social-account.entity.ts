import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { User } from '../../users/user.entity';
import { SocialAccount } from './social-account.entity';
import type { Social } from './social.entity';

@Entity({ discriminatorValue: 'user' })
export class UserSocialAccount extends SocialAccount {
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  constructor(options: {
    social: Social;
    link?: string;
    pseudo: string;
    user: User;
  }) {
    super(options);
    this.user = options.user;
  }
}
