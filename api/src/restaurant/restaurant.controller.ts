import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from '../shared/lib/pipes/parse-date.pipe';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { DailyInfo } from './daily-info/daily-info.entity';
import type { DailyMenu } from './daily-menus/daily-menu.entity';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@Controller({ path: 'restaurant' })
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
  ) {}

  @Get('/date')
  @CheckPolicies(ability => ability.can(Action.Read, DailyInfo))
  public async getDate(@Query('date', ParseDatePipe) date: string): Promise<{ menu: DailyMenu | null; info: DailyInfo | null }> {
    const wantedDate = date === 'today' ? new Date() : new Date(date);
    return {
      menu: await this.restaurantService.findOneDateMenu(wantedDate),
      info: await this.restaurantService.findAllDateInfo(wantedDate),
    };
  }
}
