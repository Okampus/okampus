import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Content } from '../create/contents/entities/content.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../shared/modules/notifications/notifications.module';
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
