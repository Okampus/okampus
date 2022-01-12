import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Club } from '../clubs/club.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { User } from '../users/user.entity';
import { ClubSocialAccount } from './entities/club-social-account.entity';
import { SocialAccount } from './entities/social-account.entity';
import { Social } from './entities/social.entity';
import { UserSocialAccount } from './entities/user-social-account.entity';
import { SocialsController } from './socials.controller';
import { SocialsService } from './socials.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Social, SocialAccount, UserSocialAccount, ClubSocialAccount, User, Club]),
  ],
  controllers: [SocialsController],
  providers: [CaslAbilityFactory, SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
