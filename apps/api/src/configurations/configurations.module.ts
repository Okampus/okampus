import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { config } from '../shared/configs/config';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { Configuration } from './configurations/configurations.entity';
import { ConfigurationsCoreModule } from './configurations/configurations.module';
import { ValidationStepsModule } from './validation-steps/validation-steps.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Configuration]),
    RouterModule.register([{
      path: 'configurations',
      children: [
        { path: 'configurations', module: ConfigurationsCoreModule },
        { path: 'validation-steps', module: ValidationStepsModule },
      ],
    }]),
    ConfigurationsCoreModule,
    ValidationStepsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ConfigurationsModule implements OnModuleInit {
  constructor(
    @InjectRepository(Configuration) private readonly configurationRepository: BaseRepository<Configuration>,
  ) {}

  public async onModuleInit(): Promise<void> {
    const configuration = await this.configurationRepository.count({ id: config.get('productName') });
    if (configuration === 0) {
      const newConfiguration = new Configuration({ id: config.get('productName') });
      await this.configurationRepository.persistAndFlush(newConfiguration);
    }
  }
}
