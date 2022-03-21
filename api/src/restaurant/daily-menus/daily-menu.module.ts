import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Food } from '../food/food.entity';
import { DailyMenusController } from './daily-menu.controller';
import { DailyMenu } from './daily-menu.entity';
import { DailyMenusService } from './daily-menu.service';

@Module({
  imports: [MikroOrmModule.forFeature([DailyMenu, Food])],
  controllers: [DailyMenusController],
  providers: [DailyMenusService],
  exports: [DailyMenusService],
})
export class DailyMenusModule {}
