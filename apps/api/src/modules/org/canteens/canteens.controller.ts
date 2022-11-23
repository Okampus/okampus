import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from '@common/lib/pipes/parse-date.pipe';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { CanteensService } from './canteens.service';
import { Menu } from './menus/menu.entity';

@ApiTags('Canteens')
@Controller({ path: 'canteens' })
export class CanteensController {
  constructor(
    private readonly restaurantService: CanteensService,
  ) {}

  @Get('/date')
  @CheckPolicies(ability => ability.can(Action.Read, Menu))
  public async getDate(
    @Query('date', ParseDatePipe) date: string,
  ): Promise<Menu | null> {
    const wantedDate = date === 'today' ? new Date() : new Date(date);
    return await this.restaurantService.findOneDateMenu(wantedDate);
  }
}
