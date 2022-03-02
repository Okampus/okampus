import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DailyInfo } from './daily-info/daily-info.entity';
import { DailyInfoModule } from './daily-info/daily-info.module';
import { DailyMenu } from './daily-menus/daily-menu.entity';
import { DailyMenusModule } from './daily-menus/daily-menu.module';
import { FoodModule } from './food/food.module';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';


@Module({
  imports: [
    MikroOrmModule.forFeature([DailyMenu, DailyInfo]),
    RouterModule.register([{
      path: 'restaurant',
      children: [
        { path: 'daily-info', module: DailyInfoModule },
        { path: 'daily-menus', module: DailyMenusModule },
        { path: 'food', module: FoodModule },
      ],
    }]),
    DailyInfoModule,
    DailyMenusModule,
    FoodModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
