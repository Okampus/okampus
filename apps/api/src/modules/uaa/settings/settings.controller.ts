import {
  Body,
  Controller,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { User } from '@uaa/users/user.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './settings.entity';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller({ path: 'settings' })
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
  ) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Settings))
  public async findOne(@CurrentUser() user: User): Promise<Settings> {
    return await this.settingsService.findOne(user);
  }

  @Patch()
  @CheckPolicies(ability => ability.can(Action.Update, Settings))
  public async update(
    @CurrentUser() user: User,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<Settings> {
    return await this.settingsService.update(user, updateSettingsDto);
  }
}
