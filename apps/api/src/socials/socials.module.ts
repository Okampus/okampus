import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../shared/modules/notifications/notifications.module';
import { Team } from '../teams/teams/team.entity';
import { Social } from './social.entity';
import { SocialsController } from './socials.controller';
import { SocialsService } from './socials.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Social, Team]),
    NotificationsModule,
  ],
  controllers: [SocialsController],
  providers: [CaslAbilityFactory, SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
