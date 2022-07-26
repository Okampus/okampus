import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { ConfigurationsController } from './configurations.controller';
import { Configuration } from './configurations.entity';
import { ConfigurationsService } from './configurations.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Configuration]),
  ],
  controllers: [ConfigurationsController],
  providers: [CaslAbilityFactory, ConfigurationsService],
  exports: [ConfigurationsService],
})
export class ConfigurationsCoreModule {}
