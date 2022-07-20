import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings } from './settings.entity';
import { SettingsService } from './settings.service';

@Resolver(() => Settings)
export class SettingsResolver {
  constructor(
    private readonly settingsService: SettingsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Settings)
  public async settings(@CurrentUser() user: User): Promise<Settings> {
    return await this.settingsService.findOne(user);
  }

  @Mutation(() => Settings)
  public async updateSettings(
    @CurrentUser() user: User,
    @Args('settings') settings: UpdateSettingsDto,
  ): Promise<Settings> {
    return await this.settingsService.update(user, settings);
  }
}
