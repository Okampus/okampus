import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { User } from '../users/user.entity';
import type { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings) private readonly settingsRepository: BaseRepository<Settings>,
  ) {}

  public async findOne(user: User): Promise<Settings> {
    return await this.settingsRepository.findOneOrFail({ user }, { populate: ['user'] });
  }

  public async update(user: User, updateSettingsDto: UpdateSettingsDto): Promise<Settings> {
    const settings = await this.settingsRepository.findOneOrFail({ user }, { populate: ['user'] });

    wrap(settings).assign(updateSettingsDto);
    await this.settingsRepository.flush();
    return settings;
  }
}
