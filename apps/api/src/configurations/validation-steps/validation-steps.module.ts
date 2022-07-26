import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { Configuration } from '../configurations/configurations.entity';
import { ValidationStep } from './validation-step.entity';
import { ValidationStepsController } from './validation-steps.controller';
import { ValidationStepsService } from './validation-steps.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ValidationStep, Configuration, User]),
  ],
  controllers: [ValidationStepsController],
  providers: [CaslAbilityFactory, ValidationStepsService],
  exports: [ValidationStepsService],
})
export class ValidationStepsModule {}
