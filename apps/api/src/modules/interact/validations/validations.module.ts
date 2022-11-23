import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { Content } from '@modules/create/contents/entities/content.entity';
import { Validation } from './validation.entity';
import { ValidationsResolver } from './validations.resolver';
import { ValidationsService } from './validations.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Validation, Content]),
    NotificationsModule,
  ],
  controllers: [],
  providers: [ValidationsResolver, ValidationsService, CaslAbilityFactory],
  exports: [ValidationsService],
})
export class ValidationsModule {}
