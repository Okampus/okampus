import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@meta/shared/modules/notifications/notifications.module';
import { Team } from '../team.entity';
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
