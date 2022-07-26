import {
  Body,
  Controller,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { Configuration } from './configurations.entity';
import { ConfigurationsService } from './configurations.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@ApiTags('Configurations')
@Controller()
export class ConfigurationsController {
  constructor(
    private readonly configurationsService: ConfigurationsService,
  ) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Configuration))
  public async findThe(): Promise<Configuration> {
    return await this.configurationsService.findThe();
  }

  @Patch()
  @CheckPolicies(ability => ability.can(Action.Update, Configuration))
  public async update(@Body() updateConfigurationDto: UpdateConfigurationDto): Promise<Configuration> {
    return await this.configurationsService.update(updateConfigurationDto);
  }
}
