import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@meta/shared/modules/notifications/notifications.module';
import { ValidationStep } from '@modules/org/tenants/validation-steps/validation-step.entity';
import { TeamEvent } from '../events/team-event.entity';
import { TeamEventValidationsController } from './event-validations.controller';
import { TeamEventValidationsService } from './event-validations.service';
import { TeamEventValidation } from './team-event-validation.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([ValidationStep, TeamEvent, TeamEventValidation]),
    NotificationsModule,
  ],
  controllers: [TeamEventValidationsController],
  providers: [CaslAbilityFactory, TeamEventValidationsService],
  exports: [TeamEventValidationsService],
})
export class TeamEventValidationsModule {}
