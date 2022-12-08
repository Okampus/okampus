import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { Social } from './social.entity';
import { SocialsController } from './socials.controller';
import { SocialsService } from './socials.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Social]),
    NotificationsModule,
  ],
  controllers: [SocialsController],
  providers: [CaslAbilityFactory, SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
