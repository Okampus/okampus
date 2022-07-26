import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { config } from '../../shared/configs/config';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { Configuration } from './configurations.entity';
import type { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectRepository(Configuration) private readonly configurationRepository: BaseRepository<Configuration>,
  ) {}

  public async findThe(): Promise<Configuration> {
    return await this.configurationRepository.findOneOrFail({ id: config.get('productName') });
  }

  public async update(updateConfigurationDto: UpdateConfigurationDto): Promise<Configuration> {
    const configuration = await this.configurationRepository.findOneOrFail({ id: config.get('productName') });

    wrap(configuration).assign(updateConfigurationDto);
    await this.configurationRepository.flush();
    return configuration;
  }
}
