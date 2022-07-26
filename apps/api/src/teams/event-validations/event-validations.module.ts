import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ValidationStep } from '../../configurations/validation-steps/validation-step.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamEvent } from '../events/team-event.entity';
import { TeamEventValidationsController } from './event-validations.controller';
import { TeamEventValidationsService } from './event-validations.service';
import { TeamEventValidation } from './team-event-validation.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([ValidationStep, TeamEvent, TeamEventValidation]),
  ],
  controllers: [TeamEventValidationsController],
  providers: [CaslAbilityFactory, TeamEventValidationsService],
  exports: [TeamEventValidationsService],
})
export class TeamEventValidationsModule {}
